import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";
import { chatController, deleteChatController, getChatByUserIdController, newChatController } from "../controllers/chat.controllers.js";

const chatRouter = Router();

chatRouter.post('/response', verifyAuthMiddleware, chatController);
chatRouter.post('/new', verifyAuthMiddleware, newChatController);
chatRouter.delete('/delete', verifyAuthMiddleware, deleteChatController);
chatRouter.post('/get', verifyAuthMiddleware, getChatByUserIdController);

export default chatRouter;