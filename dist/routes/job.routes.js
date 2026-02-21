import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";
import { getJobStatus } from "../controllers/job.controller.js";
const jobRouter = Router();
jobRouter.get('/status/:jobId', verifyAuthMiddleware, getJobStatus);
export default jobRouter;
