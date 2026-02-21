import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";
import { getMemoryController, saveMemoryController, getPublicMemoriesController, deleteMemoryController, updateMemoryController } from "../controllers/memory.controller.js";

const memoryRouter = Router();

memoryRouter.get("/get/:id", verifyAuthMiddleware, getMemoryController)
memoryRouter.post("/save", verifyAuthMiddleware, saveMemoryController);
memoryRouter.get("/public", getPublicMemoriesController);
memoryRouter.delete("/delete", verifyAuthMiddleware, deleteMemoryController);
memoryRouter.put("/update", verifyAuthMiddleware, updateMemoryController);

export { memoryRouter };