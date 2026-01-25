import { Request, Response } from "express";
import supabase from "../config/supabase.config.js";

export const getMemoryController = async (req: Request, res: Response) => {

    const id = req.params.id;
    const user_id = req.user?.id;

    if (user_id !== id) {
        const memory = supabase.from('memory').select('*').eq('user_id', user_id).eq('visibility', 'public');
    }

    const memory = supabase.from('memory').select('*').eq('user_id', user_id);

    res.json({ message: memory });
}

export const saveMemoryController = async (req: Request, res: Response) => {
    const user_id = req.user?.id;
    const { chat_id, charadter_id, chats, visibility } = req.body;

    const { error } = await supabase.from('memory').insert({
        user_id,
        chat_id,
        charadter_id,
        chats,
        visibility
    });

    if (error) {
        res.status(500).json({ message: `Error: ${error.message}` });
        return;
    }

    res.json({ message: "Memory saved successfully." });
}