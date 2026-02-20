import supabase from "../../config/supabase.config.js";

export async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: 'https://kisschat.ai/auth/callback'
        }
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}