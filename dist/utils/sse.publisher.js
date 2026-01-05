import { getRedisConnection } from "../config/redis.config.js";
import Redis from "ioredis";
// Create Redis publisher for worker to send SSE messages
const publisher = new Redis(getRedisConnection());
export async function publishSSEMessage(jobId, data) {
    try {
        await publisher.publish('sse-messages', JSON.stringify({
            jobId,
            data,
            close: false
        }));
        console.log(`[SSE Publisher] Published message for job ${jobId}`);
        return true;
    }
    catch (error) {
        console.error(`[SSE Publisher] Error publishing message for job ${jobId}:`, error);
        return false;
    }
}
export async function publishSSEClose(jobId) {
    try {
        await publisher.publish('sse-messages', JSON.stringify({
            jobId,
            data: null,
            close: true
        }));
        console.log(`[SSE Publisher] Published close signal for job ${jobId}`);
        return true;
    }
    catch (error) {
        console.error(`[SSE Publisher] Error publishing close for job ${jobId}:`, error);
        return false;
    }
}
