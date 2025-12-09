import supabase from "../config/supabase.config.js";
export async function updateUserController(req, res) {
    const { id } = req.params;
    const { username, avatar_url, status, last_login } = req.body;
    const { error } = await supabase.from('users').update({
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
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json({ message: "Account deleted successfully !" });
}
