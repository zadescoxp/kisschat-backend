import { Router } from "express";
import { signUpController, loginController, logoutController, oauthCallbackController, oauthSessionController } from "../controllers/auth.controllers.js";

const authRouter = Router();

authRouter.post('/signup', signUpController);
authRouter.post('/login', loginController);
authRouter.post('/logout', logoutController);
authRouter.get('/callback', oauthCallbackController);
authRouter.post('/session', oauthSessionController);

export default authRouter;