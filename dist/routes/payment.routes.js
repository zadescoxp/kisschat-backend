import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";
import { handlePaymentCallback } from "../controllers/payment.controllers.js";
const paymentRouter = Router();
paymentRouter.get("/callback", verifyAuthMiddleware, handlePaymentCallback);
export default paymentRouter;
