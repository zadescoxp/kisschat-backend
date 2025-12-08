import app from "./app";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { verifyAuthMiddleware } from "./middlewares/verifyAuth.middlewares";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import charactersRouter from "./routes/characters.routes";
import chatRouter from "./routes/chat.routes";

dotenv.config();

const PORT = process.env.PORT;

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

try {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
catch (error) {
    console.error('Error starting the server:', error);
}