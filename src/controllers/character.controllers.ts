import { Response, Request } from "express";
import supabase from "../config/supabase.config.js";
import { deductChatKissCoins } from "../utils/kisscoin.util.js";
import { create_character_coins } from "../constants/coins.js";
import { checkCache, setCache } from "../services/cache/redis.cache.js";

export async function createCharacterController(req: Request, res: Response) {
    const { character_name, gender, heritage, age, skin_tone, eye_color, hair_color, hairstyle, body_type, breast_size, butt_size, public_description, tags, voice, personality, occupation, hobbies, scenario, greeting_message, backstory, enable_ai_generated_behavior, behaviour_preferences, avatar_url, custom_physical_trait, custom_description, system_instruction } = req.body;

    const { error } = await supabase.from('characters').insert({
        character_name,
        gender,
        heritage,
        age,
        skin_tone,
        eye_color,
        hair_color,
        hairstyle,
        body_type,
        breast_size,
        butt_size,
        public_description,
        tags,
        voice,
        personality,
        occupation,
        hobbies,
        scenario,
        greeting_message,
        backstory,
        enable_ai_generated_behavior,
        behaviour_preferences,
        avatar_url,
        custom_physical_trait,
        custom_description,
        system_instruction,
        id: req.user?.id
    })

    if (error) {
        res.status(500).json({ "error": error.message })
    }

    const result = await deductChatKissCoins(req.user?.id || '', create_character_coins);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }

    res.status(200).json({ "message": "Character created successfully" })
}

export async function getCharacterByIdController(req: Request, res: Response) {
    const { id } = req.params;

    if (await checkCache(id)) {
        const cachedData = await checkCache(id);
        return res.status(200).json({
            "message": cachedData
        });
    }

    const { data, error } = await supabase.from('characters').select("*").eq("character_id", id);

    if (error) {
        res.status(404).json({ "error": error.message });
    }

    if (data?.length == 0) {
        res.status(404).json({ "message": "No data found" })
    }

    await setCache(id, JSON.stringify(data), 300);

    res.status(200).json({
        "message": data
    })
}

export async function getAllCharactersController(req: Request, res: Response) {

    if (await checkCache("all_characters")) {
        const cachedData = await checkCache("all_characters");
        return res.status(200).json({
            "message": cachedData
        });
    }

    const { data, error } = await supabase.from('characters').select("*");

    if (error) {
        res.status(404).json({ "error": error.message });
    }

    if (data?.length == 0) {
        res.status(404).json({ "message": "No data found" })
    }

    await setCache("all_characters", JSON.stringify(data), 300);

    res.status(200).json({
        "message": data
    })
}

export async function operationCharacterController(req: Request, res: Response) {
    const { character_id, operation } = req.body;
    const user_id = req.user?.id;

    let col;

    switch (operation) {
        case 'like':
            col = 'liked_characters';
            break;
        case 'bookmark':
            col = 'bookmarked_characters';
            break;
        case 'favourite':
            col = 'favourite_characters';
            break;
        default:
            return res.status(400).json({ error: 'Invalid operation' });
    }

    const { data: existing, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq("user_id", user_id)
        .contains(col, [character_id]);

    if (fetchError && fetchError.code !== 'PGRST116') {
        console.error(fetchError);
        return res.status(500).json({ error: fetchError.message });
    }

    if (existing && existing.length > 0) {
        const { error: deleteError } = await supabase.rpc("toggle_character_interaction", {
            p_user_id: user_id,
            p_character_id: character_id,
            p_action: "remove",
            p_type: operation
        });

        if (deleteError) {
            console.error(deleteError);
            return res.status(500).json({ error: deleteError.message });
        }

        return res.status(200).json({ message: `Character un${operation}d successfully`, status: 'removed' });
    } else {
        const { error: insertError } = await supabase.rpc("toggle_character_interaction", {
            p_user_id: user_id,
            p_character_id: character_id,
            p_action: "add",
            p_type: operation
        });

        if (insertError) {
            console.error(insertError);
            return res.status(500).json({ error: insertError.message });
        }

        return res.status(200).json({ message: `Character ${operation}d successfully`, status: 'added' });
    }
}

export async function getCharacterByUserIdController(req: Request, res: Response) {

    if (await checkCache("character_" + req.user?.id)) {
        const cachedData = await checkCache("character_" + req.user?.id);
        return res.status(200).json({
            "message": JSON.parse(cachedData as string)
        });
    }

    const user_id = req.user?.id;

    const { data, error } = await supabase.from('characters').select("*").eq("id", user_id);
    if (error) {
        res.status(404).json({ "error": error.message });
    }

    if (data?.length == 0) {
        res.status(404).json({ "message": "No data found" })
    }

    await setCache("character_" + req.user?.id, JSON.stringify(data), 300);

    res.status(200).json({
        "message": data
    })
}

export async function commentCharacterController(req: Request, res: Response) {
    const { character_id, comment, comment_id = null } = req.body;
    const user_id = req.user?.id;

    let payload: {
        character_id: any;
        user_id: string | undefined;
        comment: any;
        parent_id?: any;
    } = {
        character_id,
        user_id,
        comment
    };

    if (comment_id) {
        payload.parent_id = comment_id;
    }

    const { error } = await supabase.from('character_comments').insert(payload);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: "Comment added successfully" });
}

export async function getCommentsByCharacterIdController(req: Request, res: Response) {
    const { id } = req.params;

    const { data, error } = await supabase.from('character_comments').select("*").eq("character_id", id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ comments: data });
}