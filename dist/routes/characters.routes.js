import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";
import { createCharacterController, getCharacterByIdController, operationCharacterController } from "../controllers/character.controllers.js";
const charactersRouter = Router();
charactersRouter.post('/create', verifyAuthMiddleware, createCharacterController);
charactersRouter.get("/get/:id", verifyAuthMiddleware, getCharacterByIdController);
charactersRouter.post("/operation", verifyAuthMiddleware, operationCharacterController);
export default charactersRouter;
