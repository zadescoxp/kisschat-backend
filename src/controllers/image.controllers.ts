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
        const creator_username = req.userProfile?.username || 'Unknown';

        const deduction = await deductImageKissCoins(user_id || '');

        if (!deduction.success) {
            return res.status(400).json({ error: deduction.error });
        }

        const result = await getImageApiUrl(user_id || '', details);

        const { data, error } = await supabase.from('images').insert(
            {
                id: user_id,
                details: details,
                image_link: result,
                kisscoins_used: deduction.kisscoins_used,
                creator_username: creator_username
            }
        ).select();

        if (error) {
            return res.status(500).json({ error: 'Failed to save image details.' });
        }

        res.json({
            success: true,
            message: data,
            image_url: result
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

export async function likeImageController(req: Request, res: Response) {
    const { image_id } = req.body;
    const user_id = req.user?.id;

    const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('image_id', image_id)
        .single();

    if (error || !data) {
        return res.status(404).json({ error: 'Image not found.' });
    }

    const likes = data.liked_by || [];

    if (likes.includes(user_id)) {
        const index = likes.indexOf(user_id);
        if (index > -1) {
            likes.splice(index, 1);
        }

        const { error: updateError } = await supabase
            .from('images')
            .update({ liked_by: likes })
            .eq('image_id', image_id);

        if (updateError) {
            return res.status(500).json({ error: 'Failed to unlike the image.' });
        }

        return res.json({ success: true, message: 'Image unliked successfully.' });
    }

    likes.push(user_id);

    const { error: updateError } = await supabase
        .from('images')
        .update({ liked_by: likes })
        .eq('image_id', image_id);

    if (updateError) {
        return res.status(500).json({ error: 'Failed to like the image.' });
    }

    res.json({ success: true, message: 'Image liked successfully.' });

}

export async function changeVisibilityController(req: Request, res: Response) {
    const { image_id, visibility } = req.body;
    const user_id = req.user?.id;

    const { error } = await supabase
        .from('images')
        .update({ visibility })
        .eq('image_id', image_id)
        .eq('id', user_id);

    if (error) {
        return res.status(500).json({ error: 'Failed to change image visibility.' });
    }

    res.json({ success: true, message: 'Image visibility updated successfully.' });
}

export async function deleteImageController(req: Request, res: Response) {
    const { image_id } = req.body;
    const user_id = req.user?.id;

    const { error } = await supabase
        .from('images')
        .delete()
        .eq('image_id', image_id)
        .eq('id', user_id);

    if (error) {
        return res.status(500).json({ error: 'Failed to delete the image.' });
    }

    res.json({ success: true, message: 'Image deleted successfully.' });
}

export async function getPublicImagesController(req: Request, res: Response) {
    const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('visibility', 'public');

    if (error) {
        return res.status(500).json({ error: 'Failed to fetch public images.' });
    }

    res.json({ message: data });
}

export async function photoAlbumImageGenerationController(req: Request, res: Response) {
    try {
        const { character_id, prompt } = req.body;
        const user_id = req.user?.id;
        const creator_username = req.userProfile?.username || 'Unknown';

        const { data: characterData, error: characterError } = await supabase.from('characters').select('*').eq('character_id', character_id).single();

        if (characterError) {
            return res.status(500).json({ error: 'Failed to retrieve character data.' });
        }

        const details = {
            prompt: `Generate an image of a ${characterData?.type} ${characterData?.age} years old ${characterData?.heritage} ${characterData?.gender}` + ` with ${characterData?.skin_tone} skin tone, ${characterData?.eye_color} eyes, ${characterData?.hair_color} hair in ${characterData?.hairstyle} hairstyle and ${characterData?.body_type} body type. Her occupation is ${characterData?.occupation || 'unknown'}` + prompt,
            seed: characterData?.seed || 0
        };

        const deduction = await deductImageKissCoins(user_id || '');

        if (!deduction.success) {
            return res.status(400).json({ error: deduction.error });
        }

        const result = await getImageApiUrl(user_id || '', details);

        const { data, error } = await supabase.from('characters').update({
            photo_album: [result]
        }).eq('character_id', character_id).select();

        if (error) {
            return res.status(500).json({ error: `Failed to save image details. ${error.message}` });
        }

        res.json({
            success: true,
            message: data,
            image_url: result
        });
    }
    catch (error: any) {
        console.error('Photo album image generation controller error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
}