import supabase from "../config/supabase.config";

export async function checkUser(email: string) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (error) {
        return false
        // throw new Error(error.message);
    }

    return data;
}