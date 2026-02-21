import { Router } from "express";
import { referralCodeController } from "../controllers/referral.controller.js";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";

const referralRouter = Router();

referralRouter.post('/code', verifyAuthMiddleware, referralCodeController);

export default referralRouter;