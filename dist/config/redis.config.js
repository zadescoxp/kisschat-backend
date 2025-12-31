import Redis from "ioredis";
export const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    username: process.env.REDIS_USERNAME || undefined,
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null
});
redisClient.on('connect', () => {
    console.log('Connected to Redis server');
});
redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});
