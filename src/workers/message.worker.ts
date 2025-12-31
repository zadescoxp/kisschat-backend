import dotenv from "dotenv";
dotenv.config();

import { Worker, Job } from "bullmq";
import { getRedisConnection } from "../config/redis.config.js";
import Redis from "ioredis";
import { generateResponse } from "../services/chat_models/gpu.services.js";
import supabase from "../config/supabase.config.js";

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

const messageWorker = new Worker("message-queue", async (job: Job) => {
    console.log(`\n📝 Processing job ID: ${job.id}`);

    try {
        const { messages, chat_id } = job.data;
        console.log(`Received messages for chat_id ${chat_id}:`, messages);

        // Generate AI response
        const aiResponse = await generateResponse(messages);

        // Update chat history with AI response
        const updatedChats = messages.concat([{ role: 'assistant', content: aiResponse.message.content }]);

        // Save to database
        const { error } = await supabase
            .from('chats')
            .update({ chats: updatedChats })
            .eq('chat_id', chat_id);

        if (error) {
            throw new Error(`Database update failed: ${error.message}`);
        }

        console.log(`✅ Job ID: ${job.id} completed!\n`);

        return {
            success: true,
            response: aiResponse,
            chatHistory: updatedChats,
            chat_id: chat_id,
            jobId: job.id
        };
    } catch (error: any) {
        console.error(`❌ Job ${job.id} failed:`, error.message);
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

messageWorker.on('active', (job: Job) => {
    console.log(`Job ${job.id} is now active`);
});

messageWorker.on('completed', (job: Job) => {
    console.log(`Job ${job.id} completed successfully`);
});

messageWorker.on('failed', (job: Job | undefined, err: Error) => {
    console.log(`Job ${job?.id} failed:`, err.message);
});

messageWorker.on('error', (err: Error) => {
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