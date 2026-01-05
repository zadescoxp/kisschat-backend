import dotenv from "dotenv";
dotenv.config();
import { Worker } from "bullmq";
import { getRedisConnection } from "../config/redis.config.js";
import Redis from "ioredis";
import { generateResponse } from "../services/chat_models/gpu.services.js";
import supabase from "../config/supabase.config.js";
import { publishSSEMessage, publishSSEClose } from "../utils/sse.publisher.js";
const redisConnection = getRedisConnection();
// Create dedicated connection for worker
const workerConnection = new Redis({
    ...redisConnection,
    maxRetriesPerRequest: null,
    enableReadyCheck: false
});
workerConnection.on('connect', () => console.log('✅ Worker Redis connected'));
workerConnection.on('ready', () => console.log('✅ Worker Redis ready'));
workerConnection.on('error', (err) => console.error('❌ Worker Redis error:', err.message));
const messageWorker = new Worker("message-queue", async (job) => {
    console.log(`\n📝 Processing job ID: ${job.id}`);
    try {
        const { messages, chat_id } = job.data;
        console.log(`Received messages for chat_id ${chat_id}:`, messages);
        // Generate AI response
        const aiResponse = await generateResponse(messages);
        console.log('[Worker] AI Response structure:', JSON.stringify(aiResponse, null, 2));
        // Extract the message content (handle different response formats)
        let messageContent;
        if (aiResponse.choices && aiResponse.choices[0]?.message?.content) {
            // OpenAI-compatible format
            messageContent = aiResponse.choices[0].message.content;
        }
        else if (aiResponse.message?.content) {
            // Direct message format
            messageContent = aiResponse.message.content;
        }
        else if (aiResponse.content) {
            // Simple content format
            messageContent = aiResponse.content;
        }
        else {
            throw new Error(`Unable to extract message content from response: ${JSON.stringify(aiResponse)}`);
        }
        // Update chat history with AI response
        const updatedChats = messages.concat([{ role: 'assistant', content: messageContent }]);
        // Save to database
        const { error } = await supabase
            .from('chats')
            .update({ chats: updatedChats })
            .eq('chat_id', chat_id);
        if (error) {
            throw new Error(`Database update failed: ${error.message}`);
        }
        console.log(`✅ Job ID: ${job.id} completed!\n`);
        // Send result through SSE via Redis pub/sub
        await publishSSEMessage(job.id, {
            status: 'completed',
            response: messageContent,
            fullResponse: aiResponse,
            chatHistory: updatedChats,
            chat_id: chat_id
        });
        await publishSSEClose(job.id);
        return {
            success: true,
            response: messageContent,
            fullResponse: aiResponse,
            chatHistory: updatedChats,
            chat_id: chat_id,
            jobId: job.id
        };
    }
    catch (error) {
        console.error(`❌ Job ${job.id} failed:`, error.message);
        // Send error through SSE via Redis pub/sub
        await publishSSEMessage(job.id, {
            status: 'failed',
            error: error.message
        });
        await publishSSEClose(job.id);
        throw error;
    }
}, {
    connection: workerConnection,
    concurrency: 5,
    lockDuration: 30000,
});
messageWorker.on('ready', () => {
    console.log('Worker is ready and listening for jobs!');
});
messageWorker.on('active', (job) => {
    console.log(`Job ${job.id} is now active`);
});
messageWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`);
});
messageWorker.on('failed', (job, err) => {
    console.log(`Job ${job?.id} failed:`, err.message);
});
messageWorker.on('error', (err) => {
    console.error('Worker error:', err);
});
// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down worker...');
    await messageWorker.close();
    await workerConnection.quit();
    process.exit(0);
});
console.log('Worker is running and waiting for jobs...\n');
