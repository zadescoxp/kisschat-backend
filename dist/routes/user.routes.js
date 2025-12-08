"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyAuth_middlewares_1 = require("../middlewares/verifyAuth.middlewares");
const user_controllers_1 = require("../controllers/user.controllers");
const userRouter = (0, express_1.Router)();
userRouter.put('/update/:id', verifyAuth_middlewares_1.verifyAuthMiddleware, user_controllers_1.updateUserController);
userRouter.delete('/delete/:id', verifyAuth_middlewares_1.verifyAuthMiddleware, user_controllers_1.deleteUserController);
exports.default = userRouter;
