import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";
import { giveGiftController } from "../controllers/gift.controllers.js";
const giftRouter = Router();
giftRouter.post('/give', verifyAuthMiddleware, giveGiftController);
export default giftRouter;
