import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";
import { handlePaymentCallbackController, initiatePaymentController } from "../controllers/payment.controllers.js";
const paymentRouter = Router();
paymentRouter.post("/callback", verifyAuthMiddleware, handlePaymentCallbackController);
paymentRouter.post("/generate", verifyAuthMiddleware, initiatePaymentController);
export default paymentRouter;
