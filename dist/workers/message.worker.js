import { Worker } from "bullmq";
import { redisClient } from "../config/redis.config.js";
const messageWorker = new Worker("messageQueue", async (job) => {
    console.log(`Processing job with id: ${job.id} and data:`, job.data);
    try {
        const { chatHistory, prompt, chat_id } = job.data;
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(`Completed job with id: ${job.id}`);
        return {
            response: "This is a test response from the worker",
            chat_id: chat_id,
            prompt: prompt
        };
    }
    catch (error) {
        console.error(`Error processing job ${job.id}:`, error.message);
        throw error;
    }
}, {
    connection: redisClient
});
messageWorker.on('completed', (job) => {
    console.log(`Job ${job.id} has completed!`);
});
messageWorker.on('failed', (job, err) => {
    console.log(`Job ${job?.id} has failed with error: ${err.message}`);
});
messageWorker.on('error', (err) => {
    console.error('Worker error:', err);
});
console.log('Worker is running and waiting for jobs...');
export { messageWorker };
