import { Response, Request } from "express";
import supabase from "../config/supabase.config.js";

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

    res.status(200).json({ "message": "Character created successfully" })
}

export async function getCharacterByIdController(req: Request, res: Response) {
    const { id } = req.params;
    const { data, error } = await supabase.from('characters').select("*").eq("id", id);

    if (error) {
        res.status(404).json({ "error": error.message });
    }

    if (data?.length == 0) {
        res.status(404).json({ "message": "No data found" })
    }
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

        return res.status(200).json({ message: `Character un${operation}d successfully` });
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

        return res.status(200).json({ message: `Character ${operation}d successfully` });
    }
}