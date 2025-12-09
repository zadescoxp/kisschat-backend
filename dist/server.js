import app from "./app.js";
import dotenv from "dotenv";
import { verifyAuthMiddleware } from "./middlewares/verifyAuth.middlewares.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import charactersRouter from "./routes/characters.routes.js";
import chatRouter from "./routes/chat.routes.js";
dotenv.config();
const PORT = process.env.PORT;
app.get('/', (req, res) => {
    res.json({ response: 'Server health is ok !' });
});
// Example of a protected route
app.get('/protected', verifyAuthMiddleware, (req, res) => {
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
