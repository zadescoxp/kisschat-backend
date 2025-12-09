import supabase from "../../config/supabase.config.js";

export async function signUpWithEmail({ email, password }: { email: string; password: string }) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function loginWithEmail({ email, password }: { email: string; password: string }) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw new Error(error.message);
    }

    return;
}