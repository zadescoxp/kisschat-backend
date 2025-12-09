import { getCharacterResponse, getNewChatID } from "../services/chat_models/chat.services.js";
export async function chatController(req, res) {
    const { chat_id, prompt } = req.body;
    const characterDetails = await getCharacterResponse(chat_id, prompt);
    res.json({ characterDetails });
}
export async function newChatController(req, res) {
    const { character_id } = req.body;
    const user_id = req.user?.id;
    const newChat = await getNewChatID(user_id || '', character_id);
    res.json({ newChatID: newChat.chat_id });
}
