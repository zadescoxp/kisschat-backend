import { Router } from "express";
import { getRewards } from "../controllers/rewards.controller.js";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";

const rewardsRouter = Router();

// rewardsRouter.get("/check-claim", verifyAuthMiddleware, checkRewardClaim);
rewardsRouter.get("/get-rewards", verifyAuthMiddleware, getRewards);

export default rewardsRouter;