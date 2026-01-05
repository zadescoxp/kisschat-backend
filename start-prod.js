import { spawn } from 'child_process';

console.log('Starting API server and worker...');

// Start the API server
const server = spawn('node', ['./dist/server.js'], {
    stdio: 'inherit',
    env: process.env
});

// Start the worker
const worker = spawn('node', ['./dist/workers/message.worker.js'], {
    stdio: 'inherit',
    env: process.env
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down...');
    server.kill('SIGTERM');
    worker.kill('SIGTERM');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down...');
    server.kill('SIGINT');
    worker.kill('SIGINT');
    process.exit(0);
});

server.on('exit', (code) => {
    console.log(`Server exited with code ${code}`);
    worker.kill();
    process.exit(code);
});

worker.on('exit', (code) => {
    console.log(`Worker exited with code ${code}`);
    server.kill();
    process.exit(code);
});
