import { Router } from "express";
import { checkRewardClaim, getRewards } from "../controllers/rewards.controllers.js";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";
const rewardsRouter = Router();
rewardsRouter.get("/check-claim", verifyAuthMiddleware, checkRewardClaim);
rewardsRouter.post("/get-rewards", verifyAuthMiddleware, getRewards);
export default rewardsRouter;
