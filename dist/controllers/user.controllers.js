import supabase from "../config/supabase.config.js";
export async function updateUserController(req, res) {
    const { id } = req.params;
    const { username, avatar_url, status, last_login } = req.body;
    const { error } = await supabase.from('profiles').update({
        username,
        avatar_url,
        status,
        last_login
    }).eq('id', id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json({ message: "Account updated successfully !" });
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
    const user_id = (await supabase.auth.getUser()).data.user?.id;
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
    res.json({ message: "Followed user successfully !" });
}
export async function getUserByIdController(req, res) {
    const { id } = req.params;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    if (data?.length === 0) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json({ user: data[0] });
}
export async function getUserPremiumByIdController(req, res) {
    const { id } = req.params;
    const { data, error } = await supabase.from('premium').select('*').eq('user_id', id).single();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json({ premiumInfo: data });
}
