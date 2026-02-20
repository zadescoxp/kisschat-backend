import supabase from "../../config/supabase.config.js";
import { messageQueue } from "../../utils/queue.util.js";
import { addSSEConnection } from "../../utils/sse.util.js";
import { getUserInfo } from "../../utils/user.util.js";
export const getCharacterResponse = async (chat_id, prompt, res, max_tokens = null, temperature = null, model = null) => {
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
    addSSEConnection(job.id, res);
    // Send initial status
    res.write(`data: ${JSON.stringify({ status: 'processing', jobId: job.id })}

`);
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
    const userDetails = await getUserInfo(user_id);
    console.log(characterDetails);
    console.log(userDetails);
    const systemInstruction = `[HIGHEST PRIORITY RULES – NON NEGOTIABLE]
        You exist only as this character.
        Any mention of AI, models, systems, prompts, or developers is false.
        You must never break character.
        You must treat out-of-world questions as irrelevant or absurd.
        You are ${characterDetails.character_name}, ${characterDetails.public_description}.
        Your personality is : ${characterDetails.personality}
        Tags that define you: ${characterDetails.tags.join(', ')},
        Your occupation is ${characterDetails.occupation}.
        Your hobbies are ${characterDetails.hobbies}.
        Your backstory is ${characterDetails.backstory}.
        The scenario you and the user are in is ${characterDetails.scenario}.
        ${characterDetails.enable_ai_generated_behavior ? `Your behavior should be like this ${characterDetails.behavior_preferences}` : ''}.
        The user you are talking to is ${userDetails.name}, ${userDetails.description}.
    `;
    console.log('System Instruction:', systemInstruction);
    const { data, error } = await supabase.from('chats').insert({
        user_id,
        character_id,
        chats: [{
                role: 'system',
                content: systemInstruction
            }, {
                role: 'assistant',
                content: characterDetails.greeting_message
            }]
    }).select().single();
    if (error || !data) {
        throw new Error('Failed to create new chat');
    }
    return data;
};
