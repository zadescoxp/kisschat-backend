"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyAuth_middlewares_1 = require("../middlewares/verifyAuth.middlewares");
const chat_controllers_1 = require("../controllers/chat.controllers");
const chatRouter = (0, express_1.Router)();
chatRouter.post('/response', verifyAuth_middlewares_1.verifyAuthMiddleware, chat_controllers_1.chatController);
chatRouter.post('/new', verifyAuth_middlewares_1.verifyAuthMiddleware, chat_controllers_1.newChatController);
exports.default = chatRouter;
