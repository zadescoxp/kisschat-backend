import supabase from "../../config/supabase.config.js";
import { messageQueue } from "../../utils/queue.util.js";
import { addSSEConnection } from "../../utils/sse.util.js";
import { Response } from "express";

export const getCharacterResponse = async (chat_id: string, prompt: string, res: Response) => {
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
}

const getCharacterDetails = async (character_id: string) => {
    const { data, error } = await supabase.from('characters').select('*').eq('character_id', character_id).single();

    if (error || !data) {
        throw new Error('Character not found');
    }
    return data;
}

export const getNewChatID = async (user_id: string, character_id: string, visibility: string) => {
    const characterDetails = await getCharacterDetails(character_id);

    if (visibility !== 'public' && visibility !== 'private' && visibility !== 'unlisted' && visibility !== 'anonymous') {
        throw new Error('Invalid visibility option');
    }

    if (!visibility) visibility = 'public';

    const { data, error } = await supabase.from('chats').insert({
        user_id,
        character_id,
        visibility,
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