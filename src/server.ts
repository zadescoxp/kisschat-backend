import app from "./app.js";
import dotenv from "dotenv";
import { Request, Response } from "express";
import cors from 'cors';
import { verifyAuthMiddleware } from "./middlewares/verifyAuth.middlewares.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import charactersRouter from "./routes/characters.routes.js";
import chatRouter from "./routes/chat.routes.js";
import jobRouter from "./routes/job.routes.js";
import testRouter from "./routes/test.routes.js";

dotenv.config();

const PORT = process.env.PORT;

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Add your frontend URL to .env
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (req: Request, res: Response) => {
    res.json({ response: 'Server health is ok !' });
});

// Example of a protected route
app.get('/protected', verifyAuthMiddleware, (req: Request, res: Response) => {
    res.json({
        message: 'This is a protected route',
        user: req.user
    });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/character', charactersRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/job', jobRouter);
app.use('/api/v1/test', testRouter);

try {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
catch (error) {
    console.error('Error starting the server:', error);
}