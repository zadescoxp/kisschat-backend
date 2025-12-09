import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";
import { deleteUserController, updateUserController } from "../controllers/user.controllers.js";

const userRouter = Router();

userRouter.put('/update/:id', verifyAuthMiddleware, updateUserController);
userRouter.delete('/delete/:id', verifyAuthMiddleware, deleteUserController);

export default userRouter;