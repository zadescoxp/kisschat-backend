import { Router } from "express";
import { signUpController, loginController, logoutController } from "../controllers/auth.controllers.js";

const authRouter = Router();

authRouter.post('/signup', signUpController);
authRouter.post('/login', loginController);
authRouter.post('/logout', logoutController);

export default authRouter;