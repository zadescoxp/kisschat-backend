import supabase from "../config/supabase.config.js";
export async function getUserInfo(user_id) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user_id)
        .limit(1)
        .maybeSingle();
    if (error) {
        throw new Error(error.message);
    }
    return data;
}
