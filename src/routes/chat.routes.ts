import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares";
import { chatController, newChatController } from "../controllers/chat.controllers";

const chatRouter = Router();

chatRouter.post('/response', verifyAuthMiddleware, chatController);
chatRouter.post('/new', verifyAuthMiddleware, newChatController);

export default chatRouter;