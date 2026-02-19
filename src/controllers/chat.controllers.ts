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

        const { data: characterData, error: characterError } = await supabase
            .from('chats')
            .select('character_id')
            .eq('chat_id', chat_id)
            .single();

        if (characterError || !characterData) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        const limitCheck = await characterChatsLimitController(req.user?.id || '', characterData.character_id);
        if (!limitCheck.canChat) {
            return res.status(403).json({ error: limitCheck.message });
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
        .limit(1);

    if (chatError) {
        return res.status(500).json({ error: chatError.message });
    }

    if (chatData && chatData.length > 0) {
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

export async function checkNewChatLimitController(req: Request, res: Response) {
    const user_id = req.user?.id;

    const { data, error } = await supabase
        .from('chats')
        .select('*', { count: 'exact' })
        .eq('user_id', user_id)

    const check = await checkUserPremium(user_id || '');

    if (check && check.isPremium) {
        const normalizedPlan = check.plan?.toLowerCase();

        if (normalizedPlan === 'spark' || normalizedPlan === 'basic') {
            if (data && data.length >= 75) {
                return res.json({ canCreate: false, message: "You have reached the maximum number of chats for Spark plan. Please save your current chats to memory to create new ones or consider upgrading your plan." });
            }
        } else if (normalizedPlan === 'ember' || normalizedPlan === 'pro') {
            if (data && data.length >= 200) {
                return res.json({ canCreate: false, message: "You have reached the maximum number of chats for Ember plan. Please save your current chats to memory to create new ones or consider upgrading to Inferno plan." });
            }
        } else if (normalizedPlan === 'inferno' || normalizedPlan === 'deluxe') {
            return res.json({ canCreate: true });
        }
    } else {
        if (data && data.length >= 2) {
            return res.json({ canCreate: false, message: "You have reached the maximum number of chats. Please save your current chats to memory to create new ones." });
        }
    }

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json({ canCreate: true });
}

async function characterChatsLimitController(user_id: string, character_id: string) {
    const { data, error } = await supabase
        .from('chats')
        .select('chats')
        .eq('user_id', user_id)
        .eq('character_id', character_id)

    if (error) {
        return { success: false, error: error.message };
    }

    const count = data[0]?.chats.length || 1;

    const check = await checkUserPremium(user_id || '');

    if (check && check.isPremium) {
        const normalizedPlan = check.plan?.toLowerCase();

        if (normalizedPlan === 'spark' || normalizedPlan === 'basic') {
            if (count >= 75) {
                return { canChat: false, message: "You have reached the maximum number of messages for this character in Spark plan. Please save your current chats to memory to continue chatting or consider upgrading your plan." };
            }
        } else if (normalizedPlan === 'ember' || normalizedPlan === 'pro') {
            if (count >= 200) {
                return { canChat: false, message: "You have reached the maximum number of messages for this character in Ember plan. Please save your current chats to memory to continue chatting or consider upgrading to Inferno plan." };
            }
        } else if (normalizedPlan === 'inferno' || normalizedPlan === 'deluxe') {
            return { canChat: true };
        }
    } else {
        if (count >= 2) {
            return { canChat: false, message: "You have reached the maximum number of messages for this character. Please save your current chats to memory to continue chatting." };
        }
    }

    return { canChat: true };
}