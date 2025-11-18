import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares";
import { createCharacterController, getCharacterByIdController } from "../controllers/character.controllers";

const charactersRouter = Router();

charactersRouter.post('/create', verifyAuthMiddleware, createCharacterController);
charactersRouter.get("/get/:id", verifyAuthMiddleware, getCharacterByIdController);

export default charactersRouter;