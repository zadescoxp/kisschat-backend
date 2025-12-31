import supabase from "../../config/supabase.config.js";
import { messageQueue } from "../../utils/queue.util.js";
export const getCharacterResponse = async (chat_id, prompt) => {
    const chat_data = await supabase.from('chats').select('*').eq('chat_id', chat_id).single();
    if (chat_data.error || !chat_data.data) {
        throw new Error('Character not found');
    }
    const res = await messageQueue.add("response", {
        chatHistory: chat_data.data.chats,
        prompt: prompt,
        chat_id: chat_id,
        is_premium: supabase.auth.getUser().then(({ data }) => data.user?.app_metadata?.premium || false)
    });
    console.log('Job added to queue with ID:', res.id);
    return { message: `Your request is being processed. Job ID: ${res.id}` };
    // const response = await getResponse(chat_data.data.chats.concat([{ role: 'user', content: prompt }]));
    // if (!response.choices || response.choices.length === 0) {
    //     throw new Error('No response from model');
    // }
    // console.log(response);
    // const updatedChats = [
    //     ...chat_data.data.chats,
    //     { role: 'user', content: prompt },
    //     { role: 'assistant', content: response.choices[0].message.content }
    // ];
    // const { error } = await supabase.from('chats').update({ chats: updatedChats }).eq('chat_id', chat_id);
    // if (error) {
    //     throw new Error('Failed to update chat history');
    // }
    // return {
    //     response: response.choices[0].message.content,
    //     chatHistory: updatedChats
    // };
};
const getCharacterDetails = async (character_id) => {
    const { data, error } = await supabase.from('characters').select('*').eq('character_id', character_id).single();
    if (error || !data) {
        throw new Error('Character not found');
    }
    return data;
};
export const getNewChatID = async (user_id, character_id) => {
    const characterDetails = await getCharacterDetails(character_id);
    const { data, error } = await supabase.from('chats').insert({
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
