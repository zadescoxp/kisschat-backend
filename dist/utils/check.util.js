import supabase from "../config/supabase.config.js";
export async function checkUser(email) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
    if (error) {
        return false;
        // throw new Error(error.message);
    }
    return data;
}
