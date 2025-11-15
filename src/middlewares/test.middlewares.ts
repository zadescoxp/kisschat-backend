import { Request, Response } from 'express';

export const testMiddleware = (req: Request, res: Response, next: Function) => {
    console.log('Test middleware executed');
    next();
}