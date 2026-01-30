import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";
import { handleCryptoPaymentCallbackController, initiateCryptoPaymentController } from "../controllers/payment.controllers.js";

const paymentRouter = Router();

paymentRouter.post("/crypto/webhook", handleCryptoPaymentCallbackController);
paymentRouter.post("/crypto/generate", verifyAuthMiddleware, initiateCryptoPaymentController);

export default paymentRouter;