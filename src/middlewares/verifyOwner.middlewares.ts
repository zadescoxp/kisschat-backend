import { Request, Response, NextFunction } from "express";
import supabase from "../config/supabase.config.js";

export async function verifyOwnerMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const characterId = req.params.id;

        if (!characterId) {
            return res.status(400).json({ error: 'Character ID is required' });
        }

        // Fetch the character from the database
        const { data: character, error } = await supabase
            .from('characters')
            .select('character_user_id')
            .eq('id', characterId)
            .single();

        if (error || !character) {
            return res.status(404).json({ error: 'Character not found' });
        }

        // Check if the authenticated user is the owner of the character
        if (character.character_user_id !== req.user?.id) {
            return res.status(403).json({ error: 'You do not have permission to access this resource' });
        }

        next();
    } catch (err) {
        console.error('Error in verifyOwnerMiddleware:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}