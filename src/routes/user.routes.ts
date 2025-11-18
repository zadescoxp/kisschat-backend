import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares";
import { createUserController, deleteUserController, updateUserController } from "../controllers/user.controllers";

const userRouter = Router();

userRouter.post('/create', verifyAuthMiddleware, createUserController);
userRouter.put('/update/:id', verifyAuthMiddleware, updateUserController);
userRouter.delete('/delete/:id', verifyAuthMiddleware, deleteUserController);

export default userRouter;