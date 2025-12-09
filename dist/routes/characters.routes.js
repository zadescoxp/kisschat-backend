import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";
import { createCharacterController, getCharacterByIdController } from "../controllers/character.controllers.js";
const charactersRouter = Router();
charactersRouter.post('/create', verifyAuthMiddleware, createCharacterController);
charactersRouter.get("/get/:id", verifyAuthMiddleware, getCharacterByIdController);
export default charactersRouter;
