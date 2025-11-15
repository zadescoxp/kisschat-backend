import express from 'express';
import { testController } from '../controllers/test.controllers';
import { testMiddleware } from '../middlewares/test.middlewares';

const testRouter = express.Router();

testRouter.get('/test', testMiddleware, testController);

export default testRouter;