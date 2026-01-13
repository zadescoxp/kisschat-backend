import supabase from "../../config/supabase.config.js";
export async function signInWithDiscord() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
            redirectTo: 'https://kisschat-ai.vercel.app/auth/callback'
        }
    });
    if (error) {
        throw new Error(error.message);
    }
    return data;
}
