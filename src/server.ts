import app from "./app";
import dotenv from "dotenv";
import { Request, Response } from "express";
import testRouter from "./routes/test.routes";

dotenv.config();

const PORT = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
    res.json({ response: 'Server health is ok !' });
});
app.use('/api', testRouter);

try {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
catch (error) {
    console.error('Error starting the server:', error);
}