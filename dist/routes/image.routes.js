import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";
import { generateImageController, rateImageController, saveGeneratedImage } from "../controllers/image.controllers.js";
const imageRouter = Router();
imageRouter.post('/rate', verifyAuthMiddleware, rateImageController);
imageRouter.post('/generate', verifyAuthMiddleware, generateImageController);
imageRouter.post('/save', verifyAuthMiddleware, saveGeneratedImage);
export default imageRouter;
