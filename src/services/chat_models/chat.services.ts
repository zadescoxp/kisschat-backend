import supabase from "../../config/supabase.config.js";
import getResponse from "../../config/openrouter.config.js";
import { messageQueue } from "../../utils/queue.util.js";
import { addSSEConnection } from "../../utils/sse.util.js";
import { Response } from "express";

export const getCharacterResponse = async (chat_id: string, prompt: string, res: Response) => {
    const chat_data = await supabase.from('chats').select('*').eq('chat_id', chat_id).single();
    if (chat_data.error || !chat_data.data) {
        throw new Error('Character not found');
    }

    let messages = chat_data.data.chats.concat([{ role: 'user', content: prompt }]);

    const job = await messageQueue.add("response", {
        messages: messages,
        chat_id: chat_id,
        is_premium: await supabase.auth.getUser().then(({ data }) => data.user?.app_metadata?.premium || false)
    });

    console.log('Job added to queue with ID:', job.id);
    messageQueue.getJobCounts().then(counts => {
        console.log('Current job counts:', counts);
    });

    // Establish SSE connection and keep it open
    addSSEConnection(job.id!, res);
    
    // Send initial status
    res.write(`data: ${JSON.stringify({ status: 'processing', jobId: job.id })}

`);

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
}

const getCharacterDetails = async (character_id: string) => {
    const { data, error } = await supabase.from('characters').select('*').eq('character_id', character_id).single();

    if (error || !data) {
        throw new Error('Character not found');
    }
    return data;
}

export const getNewChatID = async (user_id: string, character_id: string) => {
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
}