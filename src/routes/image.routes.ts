import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";
import { generateImageController, getImageByIdController, getImageByUserIdController, rateImageController, saveGeneratedImage } from "../controllers/image.controllers.js";

const imageRouter = Router();

imageRouter.post('/rate', verifyAuthMiddleware, rateImageController);
imageRouter.post('/generate', verifyAuthMiddleware, generateImageController);
imageRouter.post('/save', verifyAuthMiddleware, saveGeneratedImage);
imageRouter.get('/getImageByUserId', verifyAuthMiddleware, getImageByUserIdController);
imageRouter.get('/getImageById', verifyAuthMiddleware, getImageByIdController);

export default imageRouter;