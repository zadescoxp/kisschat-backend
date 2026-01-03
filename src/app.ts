import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';

const app = express();

// Disable compression for SSE routes
app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.includes('/chat/response')) {
        res.setHeader('Content-Encoding', 'identity');
    }
    next();
});

app.use(express.json());
app.use(cookieParser());

export default app;