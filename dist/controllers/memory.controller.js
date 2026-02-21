import supabase from "../config/supabase.config.js";
export const getMemoryController = async (req, res) => {
    const id = req.params.id;
    const user_id = req.user?.id;
    if (user_id !== id) {
        const memory = supabase.from('memory').select('*').eq('user_id', user_id).eq('visibility', 'public');
    }
    const memory = supabase.from('memory').select('*').eq('user_id', user_id);
    res.json({ message: memory });
};
export const saveMemoryController = async (req, res) => {
    const user_id = req.user?.id;
    const { chat_id, visibility } = req.body;
    const { data: chatData, error: chatError } = await supabase.from('chats').select('*').eq('chat_id', chat_id).single();
    if (chatError || !chatData) {
        res.status(400).json({ message: `Error: Chat not found` });
        return;
    }
    const { error } = await supabase.from('memory').insert({
        user_id,
        chat_id,
        character_id: chatData.character_id,
        chats: chatData.chats,
        visibility
    });
    if (error) {
        res.status(500).json({ message: `Error: ${error.message}` });
        return;
    }
    res.json({ message: "Memory saved successfully." });
};
export const getPublicMemoriesController = async (req, res) => {
    try {
        const { data, error } = await supabase.from('memory').select('*').eq('visibility', 'public');
        if (error) {
            throw new Error(error.message);
        }
        res.json({ memories: data });
    }
    catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` });
    }
};
export const deleteMemoryController = async (req, res) => {
    const user_id = req.user?.id;
    const { memory_id } = req.body;
    try {
        const { error } = await supabase.from('memory').delete().eq('memory_id', memory_id).eq('user_id', user_id);
        if (error) {
            throw new Error(error.message);
        }
        res.json({ message: "Memory deleted successfully." });
    }
    catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    }
};
export const updateMemoryController = async (req, res) => {
    const user_id = req.user?.id;
    const { memory_id, visibility } = req.body;
    try {
        const { error } = await supabase.from('memory').update({ visibility }).eq('memory_id', memory_id).eq('user_id', user_id);
        if (error) {
            throw new Error(error.message);
        }
        res.json({ message: "Memory updated successfully." });
    }
    catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    }
};
