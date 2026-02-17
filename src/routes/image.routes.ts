import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";
import { changeVisibilityController, deleteImageController, generateImageController, getImageByIdController, getImageByUserIdController, getPublicImagesController, likeImageController, photoAlbumImageGenerationController, rateImageController, saveGeneratedImage } from "../controllers/image.controllers.js";
import { userMetaDataMiddleware } from "../middlewares/userMetaData.middleware.js";

const imageRouter = Router();

imageRouter.post('/rate', verifyAuthMiddleware, rateImageController);
imageRouter.post('/generate', verifyAuthMiddleware, userMetaDataMiddleware, generateImageController);
imageRouter.post('/save', verifyAuthMiddleware, userMetaDataMiddleware, saveGeneratedImage);
imageRouter.post('/getImageByUserId', verifyAuthMiddleware, getImageByUserIdController);
imageRouter.post('/getImageById', verifyAuthMiddleware, getImageByIdController);
imageRouter.post('/like', verifyAuthMiddleware, likeImageController);
imageRouter.put('/change-visibility', verifyAuthMiddleware, userMetaDataMiddleware, changeVisibilityController);
imageRouter.delete('/delete', verifyAuthMiddleware, userMetaDataMiddleware, deleteImageController);
imageRouter.post('/getAllPublicImages', getPublicImagesController);
imageRouter.post('/photo-album-image-generate', verifyAuthMiddleware, userMetaDataMiddleware, photoAlbumImageGenerationController);

export default imageRouter;