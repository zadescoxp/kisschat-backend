import supabase from "../config/supabase.config.js";
export async function checkUserPremium(user_id) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user_id)
        .single();
    if (error) {
        return false;
    }
    return data.is_premium;
}
