import { Response, Request } from "express";
import supabase from "../config/supabase.config";
import { checkUser } from "../utils/check.util";

export async function createCharacterController(req: Request, res: Response) {
    const { character_name, gender, heritage, age, skin_tone, eye_color, hair_color, hairstyle, body_type, breast_size, butt_size, public_description, tags, voice, personality, occupation, hobbies, scenario, greeting_message, backstory, enable_ai_generated_behavior, behaviour_preferences, avatar_url, custom_physical_trait, custom_description, character_user_id } = req.body;

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
        character_user_id
    })

    if (error) {
        res.status(500).json({ "error": error.message })
    }

    res.status(200).json({ "message": "Character created successfully" })
}

export async function getCharacterByIdController(req: Request, res: Response) {
    const { id } = req.params;
    const { data, error } = await supabase.from('characters').select("*").eq("character_user_id", id);

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