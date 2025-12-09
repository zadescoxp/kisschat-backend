import supabase from "../../config/supabase.config.js";

export async function signInWithDiscord() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
            redirectTo: 'http://localhost:30000'
        }
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}