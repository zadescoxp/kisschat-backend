import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";
import { generateImageController, getImageByIdController, getImageByUserIdController, likeImageController, rateImageController, saveGeneratedImage } from "../controllers/image.controllers.js";

const imageRouter = Router();

imageRouter.post('/rate', verifyAuthMiddleware, rateImageController);
imageRouter.post('/generate', verifyAuthMiddleware, generateImageController);
imageRouter.post('/save', verifyAuthMiddleware, saveGeneratedImage);
imageRouter.post('/getImageByUserId', verifyAuthMiddleware, getImageByUserIdController);
imageRouter.post('/getImageById', verifyAuthMiddleware, getImageByIdController);
imageRouter.post('/like', verifyAuthMiddleware, likeImageController);

export default imageRouter;