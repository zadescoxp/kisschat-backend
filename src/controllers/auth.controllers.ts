import { Response, Request } from "express";
import { loginWithEmail, logout, signUpWithEmail } from "../services/auth/email.services";
import { signInWithGoogle } from "../services/auth/google.services";
import { signInWithDiscord } from "../services/auth/discord.services";

export async function loginController(req: Request, res: Response) {
    const { email, password, method } = req.body;

    switch (method) {
        case 'email':
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
            break;
        case 'discord':
            const discordData = await signInWithDiscord();
            break;
        case 'google':
            const googleData = await signInWithGoogle();
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