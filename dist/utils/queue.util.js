import { Queue } from "bullmq";
import { redisClient } from "../config/redis.config.js";
const messageQueue = new Queue("messageQueue", {
    connection: redisClient
});
export { messageQueue };
