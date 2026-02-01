import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";
import { commentCharacterController, createCharacterController, getAllCharactersController, getCharacterByIdController, getCharacterByUserIdController, getCommentsByCharacterIdController, operationCharacterController } from "../controllers/character.controllers.js";
import { userMetaDataMiddleware } from "../middlewares/userMetaData.middleware.js";

const charactersRouter = Router();

charactersRouter.post('/create', verifyAuthMiddleware, createCharacterController);
charactersRouter.get("/get/:id", getCharacterByIdController);
charactersRouter.get("/getAll", getAllCharactersController);
charactersRouter.post("/operation", verifyAuthMiddleware, operationCharacterController);
charactersRouter.post("/comment", verifyAuthMiddleware, userMetaDataMiddleware, commentCharacterController);
charactersRouter.get("/getByUserId", verifyAuthMiddleware, userMetaDataMiddleware, getCharacterByUserIdController);
charactersRouter.get("/comment/:id", verifyAuthMiddleware, getCommentsByCharacterIdController);

export default charactersRouter;