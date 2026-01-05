import { Router } from "express";
const testRouter = Router();
testRouter.post("/echo", (req, res) => {
    const message = req.body.message;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    let counter = 0;
    // if (!message) {
    //     res.write("data: [ERROR] No message provided\n\n");
    //     res.end();
    //     return;
    // }
    const intervalId = setInterval(() => {
        counter += 1;
        res.write(`data: Echo ${counter}: ${message}\n\n`);
        res.end();
    }, 2000);
    // req.on("close", () => {
    //     clearInterval(intervalId);
    //     res.end();
    // });
});
export default testRouter;
