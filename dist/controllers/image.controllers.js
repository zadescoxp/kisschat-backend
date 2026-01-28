import { deductImageKissCoins, rateImageKissCoins } from "../utils/kisscoin.util.js";
import { getImageApiUrl } from "../services/image/image.services.js";
import supabase from "../config/supabase.config.js";
export async function rateImageController(req, res) {
    try {
        const { details } = req.body;
        const user_id = req.user?.id;
        const result = await rateImageKissCoins(details);
        res.json({ kiss_coins: result });
    }
    catch (error) {
        console.error('Rate image controller error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
}
export async function generateImageController(req, res) {
    try {
        const { details } = req.body;
        const user_id = req.user?.id;
        const deduction = await deductImageKissCoins(user_id || '', details);
        if (!deduction.success) {
            return res.status(400).json({ error: deduction.error });
        }
        const result = await getImageApiUrl(details);
        const { error } = await supabase.from('images').insert({
            id: user_id,
            details: details,
            image_link: result,
            kisscoins_used: deduction.kisscoins_used
        });
        if (error) {
            console.error('Supabase insert error:', error);
        }
        res.json({
            success: true,
            data: result
        });
    }
    catch (error) {
        console.error('Generate image controller error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
}
export async function saveGeneratedImage(req, res) {
    const { image_id, visibility, description } = req.body;
    const user_id = req.user?.id;
    const { error } = await supabase.from('images').update({
        visibility,
        description
    }).eq('image_id', image_id).eq('id', user_id);
    if (error) {
        console.error('Supabase update error:', error);
        return res.status(500).json({ error: 'Failed to update image details.' });
    }
    res.json({ success: true });
}
