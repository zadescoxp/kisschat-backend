import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";
import { deleteUserController, followUserController, getUserByIdController, getUserPremiumByIdController, updateUserController, updateUserSocialMediaController } from "../controllers/user.controllers.js";

const userRouter = Router();

userRouter.put('/update', verifyAuthMiddleware, updateUserController);
userRouter.delete('/delete/:id', verifyAuthMiddleware, deleteUserController);
userRouter.post('/follow', verifyAuthMiddleware, followUserController);
userRouter.get('/getByUserId/:id', getUserByIdController);
userRouter.get('/getPremiumByUserId/:id', getUserPremiumByIdController);
userRouter.put('/updateSocialMedia', verifyAuthMiddleware, updateUserSocialMediaController);

export default userRouter;