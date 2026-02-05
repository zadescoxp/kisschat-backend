import { Request, Response } from "express";
import { deductImageKissCoins, rateImageKissCoins } from "../utils/kisscoin.util.js";
import { getImageApiUrl } from "../services/image/image.services.js";
import supabase from "../config/supabase.config.js";

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
        const creator_username = req.user?.raw_metadata?.display_name || 'Unknown';

        const deduction = await deductImageKissCoins(user_id || '', details);

        if (!deduction.success) {
            return res.status(400).json({ error: deduction.error });
        }

        const result = await getImageApiUrl(details);

        const { error } = await supabase.from('images').insert(
            {
                id: user_id,
                details: details,
                image_link: result,
                kisscoins_used: deduction.kisscoins_used,
                creator_username: creator_username
            }
        );

        if (error) {
            return res.status(500).json({ error: 'Failed to save image details.' });
        }

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

export async function saveGeneratedImage(req: Request, res: Response) {
    const { image_id, visibility, description } = req.body;
    const user_id = req.user?.id;
    const { error } = await supabase.from('images').update(
        {
            visibility,
            description
        }
    ).eq('image_id', image_id).eq('id', user_id);

    if (error) {
        return res.status(500).json({ error: 'Failed to update image details.' });
    }

    res.json({ success: true });
}

export async function getImageByUserIdController(req: Request, res: Response) {
    const { user_id } = req.body;

    const { data, error } = await supabase.from('images').select('*').eq('id', user_id);

    if (error) {
        return res.status(500).json({ error: 'Failed to fetch image details.' });
    }

    res.json({ message: data });
}

export async function getImageByIdController(req: Request, res: Response) {
    const { image_id } = req.body;

    const { data, error } = await supabase.from('images').select('*').eq('image_id', image_id).single();

    if (error) {
        return res.status(500).json({ error: 'Failed to fetch image details.' });
    }

    res.json({ message: data });
}