import supabase from "../../config/supabase.config.js";

export async function signInWithX() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'x' as any,
        options: {
            redirectTo: 'https://kisschat.ai/auth/callback'
        }
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}