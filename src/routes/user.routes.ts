import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";
import { deleteUserController, followUserController, updateUserController } from "../controllers/user.controllers.js";

const userRouter = Router();

userRouter.put('/update/:id', verifyAuthMiddleware, updateUserController);
userRouter.delete('/delete/:id', verifyAuthMiddleware, deleteUserController);
userRouter.post('/follow', verifyAuthMiddleware, followUserController);

export default userRouter;