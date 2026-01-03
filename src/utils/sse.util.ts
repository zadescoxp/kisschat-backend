import { Response } from "express";
import { getRedisConnection } from "../config/redis.config.js";
import Redis from "ioredis";

// Store SSE connections mapped by jobId
const sseConnections = new Map<string, Response>();

// Create Redis subscriber for SSE messages
const subscriber = new Redis(getRedisConnection());

// Listen for SSE messages from worker
subscriber.subscribe('sse-messages', (err) => {
    if (err) {
        console.error('[SSE] Failed to subscribe to Redis channel:', err);
    } else {
        console.log('[SSE] Subscribed to Redis channel for worker messages');
    }
});

subscriber.on('message', (channel, message) => {
    if (channel === 'sse-messages') {
        try {
            const { jobId, data, close } = JSON.parse(message);
            console.log(`[SSE] Received message from worker for job ${jobId}:`, data);

            if (close) {
                closeSSEConnection(jobId);
            } else {
                sendSSEMessage(jobId, data);
            }
        } catch (error) {
            console.error('[SSE] Error processing worker message:', error);
        }
    }
});

export function addSSEConnection(jobId: string, res: Response) {
    console.log(`[SSE] Connection established for job: ${jobId}`);

    // Set SSE headers (crucial for production)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

    // CORS headers for SSE
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    res.flushHeaders();

    // Store the connection
    sseConnections.set(jobId, res);

    // Send initial connection message
    res.write(`data: ${JSON.stringify({ status: 'connected', jobId })}\n\n`);

    // Clean up on client disconnect
    res.on('close', () => {
        console.log(`[SSE] Connection closed for job: ${jobId}`);
        sseConnections.delete(jobId);
    });
}

export function sendSSEMessage(jobId: string, data: any) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Store the connection
    sseConnections.set(jobId, res);

    // Send initial connection message
    res.write(`data: ${JSON.stringify({ status: 'connected', jobId })}\n\n`);

    // Clean up on client disconnect
    res.on('close', () => {
        console.log(`[SSE] Connection closed for job: ${jobId}`);
        sseConnections.delete(jobId);
    });
}

export function sendSSEMessage(jobId: string, data: any) {
    const connection = sseConnections.get(jobId);

    if (!connection) {
        console.log(`[SSE] Warning: No connection found for job: ${jobId}`);
        return false;
    }

    try {
        connection.write(`data: ${JSON.stringify(data)}\n\n`);
        console.log(`[SSE] Message sent for job: ${jobId}`);
        return true;
    } catch (error) {
        console.error(`[SSE] Error sending message for job ${jobId}:`, error);
        sseConnections.delete(jobId);
        return false;
    }
}

export function closeSSEConnection(jobId: string) {
    const connection = sseConnections.get(jobId);

    if (connection) {
        try {
            connection.write(`data: [DONE]\n\n`);
            connection.end();
        } catch (error) {
            console.error(`[SSE] Error closing connection for job ${jobId}:`, error);
        }
        sseConnections.delete(jobId);
        console.log(`[SSE] Connection closed for job: ${jobId}`);
    }
}

export function hasSSEConnection(jobId: string): boolean {
    return sseConnections.has(jobId);
}
