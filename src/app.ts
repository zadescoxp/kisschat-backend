import express, { Request, Response } from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
    res.json({ server: 'Server is running just fine' });
});

export default app;