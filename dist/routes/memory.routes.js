import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";
import { getMemoryController, saveMemoryController } from "../controllers/memory.controllers.js";
const memoryRouter = Router();
memoryRouter.get("/get/:id", verifyAuthMiddleware, getMemoryController);
memoryRouter.post("/save", verifyAuthMiddleware, saveMemoryController);
export { memoryRouter };
