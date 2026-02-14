import supabase from "../../config/supabase.config.js";
import { messageQueue } from "../../utils/queue.util.js";
import { addSSEConnection } from "../../utils/sse.util.js";
import { getUserInfo } from "../../utils/user.util.js";
import { Response } from "express";

export const getCharacterResponse = async (chat_id: string, prompt: string, res: Response, max_tokens: number | null = null, temperature: number | null = null, model: string | null = null) => {
    if (!chat_id) {
        throw new Error('Chat ID is required');
    }

    const chat_data = await supabase.from('chats').select('*').eq('chat_id', chat_id).single();
    if (chat_data.error || !chat_data.data) {
        throw new Error(`Chat not found: ${chat_data.error?.message || 'No data returned'}`);
    }

    let messages = chat_data.data.chats.concat([{ role: 'user', content: prompt }]);

    const job = await messageQueue.add("response", {
        messages: messages,
        chat_id: chat_id,
        is_premium: await supabase.auth.getUser().then(({ data }) => data.user?.app_metadata?.premium || false),
        max_tokens: max_tokens,
        temperature: temperature,
        model: model
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
    const userDetails = await getUserInfo(user_id);

    const { data, error } = await supabase.from('chats').insert({
        user_id,
        character_id,
        chats: [{
            role: 'system',
            content: JSON.stringify({
                character: characterDetails,
                user: userDetails
            })
        }, {
            role: 'assistant',
            content: characterDetails.greeting_message
        }]
    }).select().single();

    if (error || !data) {
        throw new Error('Failed to create new chat');
    }

    return data;
}