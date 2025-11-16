import app from "./app";
import dotenv from "dotenv";
import { Request, Response } from "express";
import authRouter from "./routes/auth.routes";
import { verifyAuthMiddleware } from "./middlewares/verifyAuth.middlewares";

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

app.use('/auth', authRouter);

try {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
catch (error) {
    console.error('Error starting the server:', error);
}