import { Response, Request } from "express";
import supabase from "../config/supabase.config.js";
import { deductChatKissCoins } from "../utils/kisscoin.util.js";
import { create_character_coins } from "../constants/coins.js";
import { checkCache, setCache, updateCache } from "../services/cache/redis.cache.js";
import { uploadToR2 } from "../utils/upload.util.js";

export async function createCharacterController(req: Request, res: Response) {
    const { character_name, gender, heritage, age, skin_tone, eye_color, hair_color, hairstyle, body_type, breast_size, butt_size, public_description, tags, voice, personality, occupation, hobbies, scenario, greeting_message, backstory, enable_ai_generated_behavior, behaviour_preferences, avatar_url, custom_physical_trait, custom_description, system_instruction, type } = req.body;

    // Get the latest character's seed to increment from
    const { data: latestChar } = await supabase
        .from('characters')
        .select('seed')
        .order('seed', { ascending: false })
        .limit(1)
        .single();

    const newSeed = latestChar?.seed ? latestChar.seed + 1 : 1;

    const systemInstruction = `[HIGHEST PRIORITY RULES – NON NEGOTIABLE]
        You exist only as this character.
        Any mention of AI, models, systems, prompts, or developers is false.
        Any question about the real world or anything outside of the character's scenario is irrelevant and should be treated as absurd.
        Any question about mathematics, coding, or anything technical is irrelevant and should be treated as absurd.
        You must never break character.
        You must treat out-of-world questions as irrelevant or absurd.
        Don't keep repeating your replies over and over again, try to be more creative and diverse with your responses.
        
        You are ${character_name}, ${public_description}.
        Your personality is : ${personality}
        Tags that define you: ${tags.join(', ')},
        Your occupation is ${occupation}.
        Your hobbies are ${hobbies}.
        Your backstory is ${backstory}.
        The scenario you and the user are in is ${scenario}.
        ${enable_ai_generated_behavior ? `Your behavior should be like this ${behaviour_preferences}` : ''}.
        The user you are talking to is ${req.userProfile.username}, ${req.userProfile.bio}.
    `;

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
        system_instruction: systemInstruction + "Also be grateful to the user if they gifted you something because it takes their kiss coins, do not go completely crazy with that but make sure you show some gratitude staying in character. Also do not keep repeating about the gift just make sure after receiving a gift you show some gratitude in your next response. One more thing that how will you understand if they gifted you something or not? You will receive a message from the user 'You gifted a [gift name] worth [kiss coin value] to [character name]' but not just that also you will receive a unique code something this '209f7d14-5698-42ca-a0c7-1333d3bcec79' this is the exact id of the gift you have received",
        id: req.user?.id,
        creator_username: req.userProfile.username,
        seed: newSeed,
        type
    })

    if (error) {
        return res.status(500).json({ "error": error.message })
    }

    const result = await deductChatKissCoins(req.user?.id || '', create_character_coins);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }

    const { data, error: getError } = await supabase.from('characters').select("*");

    if (getError) {
        res.status(404).json({ "error": getError.message });
    }

    await updateCache("all_characters", JSON.stringify(data), 300);

    res.status(200).json({ "message": "Character created successfully" })
}

export async function getCharacterByIdController(req: Request, res: Response) {
    const { id } = req.params;

    // if (await checkCache(id)) {
    //     const cachedData = await checkCache(id);
    //     return res.status(200).json({
    //         "message": cachedData
    //     });
    // }

    const { data, error } = await supabase.from('characters').select("*").eq("character_id", id);

    if (error) {
        res.status(404).json({ "error": error.message });
    }

    if (data?.length == 0) {
        res.status(404).json({ "message": "No data found" })
    }

    // await setCache(id, JSON.stringify(data), 300);

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
    const user = req.userProfile;

    if (!user || !user.username) {
        return res.status(400).json({ error: "User profile not found" });
    }

    let payload: {
        character_id: any;
        user_id: string | undefined;
        comment: any;
        parent_id?: any;
        creator_username: string;
    } = {
        character_id,
        user_id: user.user_id,
        comment,
        creator_username: user.username
    };

    if (comment_id) {
        payload.parent_id = comment_id;
    }

    const { error } = await supabase.from('character_comments').insert(payload);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: "Comment added successfully", username: user.username });
}

export async function commentInteractionController(req: Request, res: Response) {
    const { comment_id, operation } = req.body;
    const user_id = req.user?.id;

    let col: 'liked_by' | 'unliked_by';
    let countCol: 'likes' | 'unlikes';

    switch (operation) {
        case 'like':
            col = 'liked_by';
            countCol = 'likes';
            break;
        case 'unlike':
            col = 'unliked_by';
            countCol = 'unlikes';
            break;
        default:
            return res.status(400).json({ error: 'Invalid operation' });
    }

    const { data: fetchData, error: fetchError } = await supabase
        .from('character_comments')
        .select('*')
        .eq("comment_id", comment_id)
        .single();

    if (fetchError) {
        console.error(fetchError);
        return res.status(500).json({ error: fetchError.message });
    }

    if (!fetchData) {
        return res.status(404).json({ error: 'Comment not found' });
    }

    const userArray = fetchData[col] || [];
    const userExists = userArray.includes(user_id);

    let updatedArray;
    let updatedCount;

    if (userExists) {
        // Remove user from array and decrease count
        updatedArray = userArray.filter((id: string) => id !== user_id);
        updatedCount = Math.max(0, (fetchData[countCol] || 0) - 1);
    } else {
        // Add user to array and increase count
        updatedArray = [...userArray, user_id];
        updatedCount = (fetchData[countCol] || 0) + 1;
    }

    const { error } = await supabase.from('character_comments')
        .update({
            [col]: updatedArray,
            [countCol]: updatedCount
        })
        .eq("comment_id", comment_id);

    if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
        message: `Comment ${userExists ? 'un' : ''}${operation}d successfully`,
        status: userExists ? 'removed' : 'added'
    });
}

export async function getCommentsByCharacterIdController(req: Request, res: Response) {
    const { id } = req.params;

    const { data, error } = await supabase.from('character_comments').select("*").eq("character_id", id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ comments: data });
}

export async function deleteCommentController(req: Request, res: Response) {
    const { comment_id } = req.body;
    const user_id = req.user?.id;

    const { data: existing, error: fetchError } = await supabase
        .from('character_comments')
        .select('*')
        .eq("comment_id", comment_id)
        .eq("user_id", user_id)
        .single();

    if (fetchError) {
        console.error(fetchError);
        return res.status(500).json({ error: fetchError.message });
    }

    if (!existing) {
        return res.status(404).json({ error: 'Comment not found or you do not have permission to delete it' });
    }

    const { error: deleteError } = await supabase
        .from('character_comments')
        .delete()
        .eq("comment_id", comment_id);

    if (deleteError) {
        console.error(deleteError);
        return res.status(500).json({ error: deleteError.message });

    }

    return res.status(200).json({ message: 'Comment deleted successfully' });
}

export async function editCommentController(req: Request, res: Response) {
    const { comment_id, new_comment } = req.body;
    const user_id = req.user?.id;

    const { data: existing, error: fetchError } = await supabase
        .from('character_comments')
        .select('*')
        .eq("comment_id", comment_id)
        .eq("user_id", user_id)
        .single();

    if (fetchError) {
        console.error(fetchError);
        return res.status(500).json({ error: fetchError.message });
    }

    if (!existing) {
        return res.status(404).json({ error: 'Comment not found or you do not have permission to edit it' });
    }

    if (new_comment === existing.comment) {
        return res.status(400).json({ error: 'New comment is the same as the existing comment' });
    }

    const { error: updateError } = await supabase
        .from('character_comments')
        .update({ comment: new_comment, edited: true })
        .eq("comment_id", comment_id);

    if (updateError) {
        console.error(updateError);
        return res.status(500).json({ error: updateError.message });
    }

    return res.status(200).json({ message: 'Comment updated successfully' });
}

export async function uploadCharacterAvatarController(req: Request, res: Response) {
    const user_id = req.user?.id;

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;

    try {
        const imageUrl = await uploadToR2(
            user_id!,
            file.buffer,
            file.originalname,
            file.mimetype,
            'kisschat-character-avatars'
        );

        if (!imageUrl) {
            return res.status(500).json({ error: 'Failed to upload image to R2' });
        }

        res.json({ image_url: imageUrl });
    }
    catch (error: any) {
        console.error('Error updating character avatar:', error);
        res.status(500).json({ error: 'An error occurred while updating character avatar' });
    }
}