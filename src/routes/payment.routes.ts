import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";
import { handlePaymentCallbackController, initiateCryptoPaymentController } from "../controllers/payment.controllers.js";

const paymentRouter = Router();

paymentRouter.post("/callback", verifyAuthMiddleware, handlePaymentCallbackController);
paymentRouter.post("/crypto/generate", verifyAuthMiddleware, initiateCryptoPaymentController);

export default paymentRouter;