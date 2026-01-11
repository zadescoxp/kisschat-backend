import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";
import { deleteUserController, followUserController, getUserByIdController, updateUserController } from "../controllers/user.controllers.js";
const userRouter = Router();
userRouter.put('/update/:id', verifyAuthMiddleware, updateUserController);
userRouter.delete('/delete/:id', verifyAuthMiddleware, deleteUserController);
userRouter.post('/follow', verifyAuthMiddleware, followUserController);
userRouter.get('/getByUserId/:id', verifyAuthMiddleware, getUserByIdController);
export default userRouter;
