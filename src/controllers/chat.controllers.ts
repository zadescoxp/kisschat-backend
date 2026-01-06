import { Request, Response } from "express";
import { getCharacterResponse, getNewChatID } from "../services/chat_models/chat.services.js";
import supabase from "../config/supabase.config.js";

export async function chatController(req: Request, res: Response) {
    const { chat_id, prompt } = req.body;
    await getCharacterResponse(chat_id, prompt, res);
}

export async function newChatController(req: Request, res: Response) {
    const { character_id, visibility } = req.body;

    const user_id = req.user?.id;
    const newChat = await getNewChatID(user_id || '', character_id, visibility);

    res.json({ newChatID: newChat.chat_id });
}

export async function deleteChatController(req: Request, res: Response) {
    const { chat_id } = req.body;
    const user_id = req.user?.id;

    const { error } = await supabase
        .from('chats')
        .delete()
        .eq('chat_id', chat_id)
        .eq('user_id', user_id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json({ message: "Chat deleted successfully!" });
}

export async function getChatByUserIdController(req: Request, res: Response) {
    const { target_id } = req.body;
    const user_id = req.user?.id;
    let scope = user_id === target_id ? ['private', 'public', 'unlisted', 'anonymous'] : ['public'];
    const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', target_id)
        .in('visibility', scope);

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json({ chats: data });
}