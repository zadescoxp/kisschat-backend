import { Router } from "express";
import { automateController, enhanceImagePromptController } from "../controllers/automate.controllers";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares";

const automateRouter = Router();

automateRouter.post("/automate", verifyAuthMiddleware, automateController);
automateRouter.post("/enhance-image-prompt", verifyAuthMiddleware, enhanceImagePromptController);

export default automateRouter;