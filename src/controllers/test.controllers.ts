import { Request, Response } from 'express';

export const testController = (req: Request, res: Response) => {
    res.json({ message: 'Test endpoint is working' });
};