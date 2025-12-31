import { Request, Response } from "express";
import { getCharacterResponse, getNewChatID } from "../services/chat_models/chat.services.js";

export async function chatController(req: Request, res: Response) {
    const { chat_id, prompt } = req.body;

    const characterResponse = await getCharacterResponse(chat_id, prompt);

    res.json({ characterResponse });
}

export async function newChatController(req: Request, res: Response) {
    const { character_id } = req.body;

    const user_id = req.user?.id;
    const newChat = await getNewChatID(user_id || '', character_id);

    res.json({ newChatID: newChat.chat_id });
}   