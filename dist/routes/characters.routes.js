"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyAuth_middlewares_1 = require("../middlewares/verifyAuth.middlewares");
const character_controllers_1 = require("../controllers/character.controllers");
const charactersRouter = (0, express_1.Router)();
charactersRouter.post('/create', verifyAuth_middlewares_1.verifyAuthMiddleware, character_controllers_1.createCharacterController);
charactersRouter.get("/get/:id", verifyAuth_middlewares_1.verifyAuthMiddleware, character_controllers_1.getCharacterByIdController);
exports.default = charactersRouter;
