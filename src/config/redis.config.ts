import Redis from "ioredis";

// Function to get connection options (evaluated at runtime, not module load time)
export function getRedisConnection() {
    return {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        username: process.env.REDIS_USERNAME || undefined,
        maxRetriesPerRequest: null
    };
}

// Legacy export for backward compatibility
export const redisConnection = getRedisConnection();

// Separate client for general Redis operations
export const redisClient = new Redis(getRedisConnection());

redisClient.on('connect', () => {
    console.log('Connected to Redis server');
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});
