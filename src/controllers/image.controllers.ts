import { Request, Response } from "express";
import { deductImageKissCoins, rateImageKissCoins } from "../utils/kisscoin.util.js";
import { getImageApiUrl } from "../services/image/image.services.js";

export async function rateImageController(req: Request, res: Response) {
    try {
        const { details } = req.body;
        const user_id = req.user?.id;

        const result = await rateImageKissCoins(details);

        res.json({ kiss_coins: result });
    } catch (error: any) {
        console.error('Rate image controller error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
}

export async function generateImageController(req: Request, res: Response) {
    try {
        const { details } = req.body;
        const user_id = req.user?.id;

        const deduction = await deductImageKissCoins(user_id || '', details);

        if (!deduction.success) {
            return res.status(400).json({ error: deduction.error });
        }

        const result = await getImageApiUrl(details);

        res.json({
            success: true,
            data: result
        });
    } catch (error: any) {
        console.error('Generate image controller error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
}