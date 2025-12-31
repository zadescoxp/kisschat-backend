import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.config.js";

export const messageQueue = new Queue("message-queue", {
    connection: redisConnection
});