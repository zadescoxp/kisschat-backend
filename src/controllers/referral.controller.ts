import { Request, Response } from "express";
import { handleReferral } from "../utils/referral.util.js";

export async function referralCodeController(req: Request, res: Response) {
    const { referral_code, code } = req.body;
    const user_id = req.user?.id;

    try {
        await handleReferral(referral_code, code, user_id || '');
    }
    catch (error: any) {
        console.error("Referral code check error:", error);
        return res.status(400).json({ error: error.message || "Failed to process referral code." });
    }

    return res.json({ message: "Referral code processed successfully." });
}