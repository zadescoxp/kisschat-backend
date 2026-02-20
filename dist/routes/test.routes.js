import { Router } from "express";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middlewares.js";
import { userMetaDataMiddleware } from "../middlewares/userMetaData.middleware.js";
const testRouter = Router();
testRouter.get("/echo", verifyAuthMiddleware, userMetaDataMiddleware, (req, res) => {
    const userProfile = req.userProfile;
    res.json({
        echo: "Luada lele bsdk",
        userProfile: userProfile
    });
});
export default testRouter;
