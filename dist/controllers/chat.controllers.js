import { getCharacterResponse, getNewChatID } from "../services/chat_models/chat.services.js";
import supabase from "../config/supabase.config.js";
import { deductKissCoins } from "../utils/kisscoin.util.js";
import { chat_character_coins } from "../constants/coins.js";
export async function chatController(req, res) {
    try {
        const { chat_id, prompt } = req.body;
        if (!chat_id || !prompt) {
            return res.status(400).json({ error: 'chat_id and prompt are required' });
        }
        const ressult = await deductKissCoins(req.user?.id || '', chat_character_coins);
        if (!ressult.success) {
            return res.status(400).json({ error: ressult.error });
        }
        await getCharacterResponse(chat_id, prompt, res);
    }
    catch (error) {
        console.error('Chat controller error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
}
export async function newChatController(req, res) {
    const { character_id, visibility } = req.body;
    const user_id = req.user?.id;
    const newChat = await getNewChatID(user_id || '', character_id, visibility);
    res.json({ newChatID: newChat.chat_id });
}
export async function deleteChatController(req, res) {
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
export async function getChatByUserIdController(req, res) {
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
