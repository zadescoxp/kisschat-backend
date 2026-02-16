import app from "./app.js";
import dotenv from "dotenv";
import cors from 'cors';
import { verifyAuthMiddleware } from "./middlewares/verifyAuth.middlewares.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import charactersRouter from "./routes/characters.routes.js";
import chatRouter from "./routes/chat.routes.js";
import jobRouter from "./routes/job.routes.js";
import testRouter from "./routes/test.routes.js";
import imageRouter from "./routes/image.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import { memoryRouter } from "./routes/memory.routes.js";
import referralRouter from "./routes/referral.routes.js";
import automateRouter from "./routes/automate.routes.js";
import giftRouter from "./routes/gift.routes.js";
dotenv.config();
const PORT = process.env.PORT;
// CORS configuration
app.use(cors({
    origin: true, // Allow all origins for testing (change to specific domain in production)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'X-Requested-With'],
    exposedHeaders: ['Content-Type', 'Cache-Control']
}));
// Disable Express's default timeout for SSE connections
app.use((req, res, next) => {
    if (req.path.includes('/chat/response')) {
        req.socket.setTimeout(0);
        res.socket?.setTimeout(0);
    }
    next();
});
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
app.use('/api/v1/job', jobRouter);
app.use('/api/v1/test', testRouter);
app.use('/api/v1/image', imageRouter);
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/memory', memoryRouter);
app.use('/api/v1/referral', referralRouter);
app.use('/api/v1/automate', automateRouter);
app.use('/api/v1/gift', giftRouter);
try {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
catch (error) {
    console.error('Error starting the server:', error);
}
