"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewChatID = exports.getCharacterResponse = void 0;
const supabase_config_1 = __importDefault(require("../../config/supabase.config"));
const openrouter_config_1 = __importDefault(require("../../config/openrouter.config"));
const getCharacterResponse = async (chat_id, prompt) => {
    const chat_data = await supabase_config_1.default.from('chats').select('*').eq('chat_id', chat_id).single();
    if (chat_data.error || !chat_data.data) {
        throw new Error('Character not found');
    }
    const response = await (0, openrouter_config_1.default)(chat_data.data.chats.concat([{ role: 'user', content: prompt }]));
    if (!response.choices || response.choices.length === 0) {
        throw new Error('No response from model');
    }
    console.log(response);
    const updatedChats = [
        ...chat_data.data.chats,
        { role: 'user', content: prompt },
        { role: 'assistant', content: response.choices[0].message.content }
    ];
    const { error } = await supabase_config_1.default.from('chats').update({ chats: updatedChats }).eq('chat_id', chat_id);
    if (error) {
        throw new Error('Failed to update chat history');
    }
    return {
        response: response.choices[0].message.content,
        chatHistory: updatedChats
    };
};
exports.getCharacterResponse = getCharacterResponse;
const getCharacterDetails = async (character_id) => {
    const { data, error } = await supabase_config_1.default.from('characters').select('*').eq('character_id', character_id).single();
    if (error || !data) {
        throw new Error('Character not found');
    }
    return data;
};
const getNewChatID = async (user_id, character_id) => {
    const characterDetails = await getCharacterDetails(character_id);
    const { data, error } = await supabase_config_1.default.from('chats').insert({
        user_id,
        character_id,
        chats: [{
                role: 'system',
                content: JSON.stringify(characterDetails)
            }]
    }).select().single();
    if (error || !data) {
        throw new Error('Failed to create new chat');
    }
    return data;
};
exports.getNewChatID = getNewChatID;
