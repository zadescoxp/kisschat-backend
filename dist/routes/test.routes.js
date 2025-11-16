"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const test_controllers_1 = require("../controllers/test.controllers");
const test_middlewares_1 = require("../middlewares/test.middlewares");
const testRouter = express_1.default.Router();
testRouter.get('/test', test_middlewares_1.testMiddleware, test_controllers_1.testController);
exports.default = testRouter;
