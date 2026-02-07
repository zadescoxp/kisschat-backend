import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";
import { handleCryptoPaymentCallbackController, handleKissCoinsCryptoPaymentCallbackController, initiateCryptoPaymentController, initiateKissCoinsCryptoPaymentController } from "../controllers/cryptoPayment.controllers.js";

const paymentRouter = Router();

paymentRouter.post("/crypto/webhook", handleCryptoPaymentCallbackController);
paymentRouter.post("/crypto/generate", verifyAuthMiddleware, initiateCryptoPaymentController);
paymentRouter.post("/crypto/kiss-coins/webhook", handleKissCoinsCryptoPaymentCallbackController);
paymentRouter.post("/crypto/kiss-coins/generate", verifyAuthMiddleware, initiateKissCoinsCryptoPaymentController);

export default paymentRouter;