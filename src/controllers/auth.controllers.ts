import { Response, Request } from "express";
import { loginWithEmail, logout, signUpWithEmail } from "../services/auth/email.services.js";
import { signInWithGoogle } from "../services/auth/google.services.js";
import { signInWithDiscord } from "../services/auth/discord.services.js";
import supabase from "../config/supabase.config.js";

export async function loginController(req: Request, res: Response) {
    const { email, password, method } = req.body;

    switch (method) {
        case 'email':
            try {
                const emailData = await loginWithEmail({ email, password });
                res.cookie("sb-access-token", emailData.session.access_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 60 * 60 * 1000 // 1 hour
                });
                res.cookie("sb-refresh-token", emailData.session.refresh_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });
                res.json({ emailData });
            }
            catch (error: any) {
                res.status(400).json({ error: error.message });
            }
            break;
        case 'discord':
            const discordData = await signInWithDiscord();
            res.json({ discordData });
            break;
        case 'google':
            const googleData = await signInWithGoogle();
            res.json({ googleData });
            break;
        default:
            res.status(400).json({ error: 'Invalid login method' });
    }
}

export async function signUpController(req: Request, res: Response) {
    const { email, password, method } = req.body;

    switch (method) {
        case 'email':
            const data = await signUpWithEmail({ email, password });

            if (data.user) {
                console.log("Creating profile and premium records for new user");
                const profileInsert = await supabase.from('profiles').insert({
                    email: email,
                    created_at: new Date().toISOString(),
                    last_login: new Date().toISOString(),
                    username: email.split('@')[0],
                    user_id: data?.user.id,
                    avatar_url: 'https://www.svgrepo.com/show/525577/user-circle.svg',
                    status: 'active',
                    is_premium: false
                })

                const premiumInsert = await supabase.from('premium').insert({
                    user_id: data?.user.id,
                    is_premium: false,
                    image_credits: 2,
                    kiss_coins: 50
                })
            }
            // Set tokens if session is available
            if (data.session) {
                res.cookie("sb-access-token", data.session.access_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 60 * 60 * 1000 // 1 hour
                });
                res.cookie("sb-refresh-token", data.session.refresh_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });
            }

            res.json({ data });
            break;
        default:
            res.status(400).json({ error: 'Invalid signup method' });
    }
}

export async function logoutController(req: Request, res: Response) {
    await logout();

    // Clear the auth cookies
    res.clearCookie('sb-access-token');
    res.clearCookie('sb-refresh-token');

    res.json({ message: 'Logged out successfully' });
}