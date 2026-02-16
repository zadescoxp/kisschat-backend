import redis from "../../config/upstash.config.js";
export async function checkCache(key) {
    const value = await redis.get(key);
    return value;
}
export async function setCache(key, value, expirationInSeconds) {
    if (expirationInSeconds) {
        await redis.set(key, value, { ex: expirationInSeconds });
    }
    else {
        await redis.set(key, value);
    }
}
export async function deleteCache(key) {
    await redis.del(key);
}
export async function updateCache(key, value, expirationInSeconds) {
    await deleteCache(key);
    await setCache(key, value, expirationInSeconds);
}
