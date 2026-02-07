import { Request, Response } from "express";
import { getCharacterResponse, getNewChatID } from "../services/chat_models/chat.services.js";
import supabase from "../config/supabase.config.js";
import { deductChatKissCoins } from "../utils/kisscoin.util.js";
import { chat_character_coins } from "../constants/coins.js";
import { checkUserPremium } from "../utils/premium.util.js";
import { basicModel, proModel, deluxeModel } from "../constants/models.js";

export async function chatController(req: Request, res: Response) {
    try {
        const { chat_id, prompt, max_tokens = null, temperature = null, model = null } = req.body;

        if (!chat_id || !prompt) {
            return res.status(400).json({ error: 'chat_id and prompt are required' });
        }

        const is_premium = await checkUserPremium(req.user?.id || '');

        // Block non-premium users from using restricted features
        if (!is_premium) {
            // Block custom configuration (max_tokens or temperature)
            if (max_tokens != null || temperature != null) {
                return res.status(403).json({ error: 'Premium membership required for custom configuration.' });
            }

            // Block pro and deluxe models
            if (model && (proModel.includes(model) || deluxeModel.includes(model))) {
                return res.status(403).json({ error: 'Premium membership required for selected model.' });
            }

            // If model is provided and it's not in basicModel array, block it
            if (model && !basicModel.includes(model)) {
                return res.status(403).json({ error: 'Invalid model selection for basic users.' });
            }
        }

        const ressult = await deductChatKissCoins(req.user?.id || '', chat_character_coins);
        if (!ressult.success) {
            return res.status(400).json({ error: ressult.error });
        }

        // Proceed with chat response
        await getCharacterResponse(chat_id, prompt, res, max_tokens, temperature, model);

    } catch (error: any) {
        console.error('Chat controller error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
}

export async function newChatController(req: Request, res: Response) {
    const { character_id } = req.body;

    const user_id = req.user?.id;

    const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .select('chat_id')
        .eq('user_id', user_id)
        .eq('character_id', character_id)
        .single();

    if (chatError) {
        return res.status(500).json({ error: chatError.message });
    }

    if (chatData) {
        return res.json({ error: "Chat with this character already exists please save it to memory first before creating a new one!" });
    }

    const newChat = await getNewChatID(user_id || '', character_id);

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
    const user_id = req.user?.id;

    const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user_id)

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json({ chats: data });
}