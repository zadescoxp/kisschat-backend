import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";
import { generateImageController, rateImageController } from "../controllers/image.controllers.js";

const imageRouter = Router();

imageRouter.post('/rate', verifyAuthMiddleware, rateImageController);
imageRouter.post('/generate', verifyAuthMiddleware, generateImageController);

export default imageRouter;