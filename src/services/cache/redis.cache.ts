import redis from "../../config/upstash.config.js";

export async function checkCache(key: string) {
    const value = await redis.get(key);
    return value;
}

export async function setCache(key: string, value: string, expirationInSeconds?: number) {
    if (expirationInSeconds) {
        await redis.set(key, value, { ex: expirationInSeconds });
    } else {
        await redis.set(key, value);
    }
}

export async function deleteCache(key: string) {
    await redis.del(key);
}

export async function updateCache(key: string, value: string, expirationInSeconds?: number) {
    await deleteCache(key);
    await setCache(key, value, expirationInSeconds);
}