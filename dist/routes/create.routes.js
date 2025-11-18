"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyAuth_middlewares_1 = require("../middlewares/verifyAuth.middlewares");
const create_controllers_1 = require("../controllers/create.controllers");
const createRouter = (0, express_1.Router)();
createRouter.post('/user', verifyAuth_middlewares_1.verifyAuthMiddleware, create_controllers_1.createUserController);
exports.default = createRouter;
