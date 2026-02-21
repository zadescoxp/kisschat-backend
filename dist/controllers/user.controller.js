import supabase from "../config/supabase.config.js";
import { sendUserInteractionNotification } from "../utils/notification.util.js";
import { getUserInfo } from "../utils/user.util.js";
import { uploadToR2 } from "../utils/upload.util.js";
export async function updateUserController(req, res) {
    const { user_id, username, avatar_url, status, last_login, bio } = req.body;
    if (username) {
        const { data: existingUser, error: checkError } = await supabase
            .from('profiles')
            .select('user_id')
            .eq('username', username)
            .neq('user_id', user_id);
        if (existingUser && existingUser.length > 0) {
            return res.status(400).json({ error: 'Username already taken' });
        }
    }
    // Build update object with only provided fields
    const updateData = {};
    if (username !== undefined)
        updateData.username = username;
    if (avatar_url !== undefined)
        updateData.avatar_url = avatar_url;
    if (status !== undefined)
        updateData.status = status;
    if (last_login !== undefined)
        updateData.last_login = last_login;
    if (bio !== undefined)
        updateData.bio = bio;
    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }
    const { error } = await supabase.from('profiles').update(updateData).eq('user_id', user_id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json({ message: "Account updated successfully !" });
}
export async function updateUserSocialMediaController(req, res) {
    const { x, instagram, facebook } = req.body;
    const user_id = req.user?.id;
    const updatePayload = {
        x: x,
        instagram: instagram,
        facebook: facebook
    };
    const { error } = await supabase.from('profiles').update({
        social_media_handle: updatePayload
    }).eq('user_id', user_id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json({ message: "Social media links updated successfully !" });
}
export async function deleteUserController(req, res) {
    const { id } = req.params;
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json({ message: "Account deleted successfully !" });
}
export async function followUserController(req, res) {
    const { target_id } = req.body;
    const user_id = req.user?.id;
    const { data: followerData, error: followerError } = await supabase
        .from('profiles')
        .select('following')
        .eq('user_id', user_id)
        .contains('following', [target_id]);
    if (followerError && followerError.code !== 'PGRST116') {
        console.error(followerError);
        return res.status(500).json({ error: followerError.message });
    }
    if (followerData && followerData.length > 0) {
        const { error: unfollowError } = await supabase.rpc("toggle_follow", {
            p_user_id: user_id,
            p_target_id: target_id,
            p_action: "unfollow"
        });
        if (unfollowError) {
            console.error(unfollowError);
            return res.status(500).json({ error: unfollowError.message });
        }
        return res.json({ message: "Unfollowed user successfully !" });
    }
    const { error: followError } = await supabase.rpc("toggle_follow", {
        p_user_id: user_id,
        p_target_id: target_id,
        p_action: "follow"
    });
    if (followError) {
        console.error(followError);
        return res.status(500).json({ error: followError.message });
    }
    await sendUserInteractionNotification(`You have a new follower.`, target_id, new Date().toISOString(), user_id || null);
    res.json({ message: "Followed user successfully !" });
}
export async function getUserByIdController(req, res) {
    const { id } = req.params;
    try {
        const data = await getUserInfo(id);
        if (!data) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user: data });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
export async function getUserPremiumByIdController(req, res) {
    const { id } = req.params;
    const { data, error } = await supabase.from('premium').select('*').eq('user_id', id).limit(1).single();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json({ premiumInfo: data });
}
export async function updateUserProfilePictureController(req, res) {
    const user_id = req.user?.id;
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    try {
        const imageUrl = await uploadToR2(user_id, file.buffer, file.originalname, file.mimetype, 'kisschat-pfp');
        if (!imageUrl) {
            return res.status(500).json({ error: 'Failed to upload image to R2' });
        }
        const { error } = await supabase.from('profiles').update({
            avatar_url: imageUrl
        }).eq('user_id', user_id);
        if (error) {
            return res.status(500).json({ error: 'Failed to update profile picture' });
        }
        res.json({ message: 'Profile picture updated successfully', avatar_url: imageUrl });
    }
    catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
