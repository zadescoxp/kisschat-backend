"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = loginController;
exports.signUpController = signUpController;
exports.logoutController = logoutController;
const email_services_1 = require("../services/auth/email.services");
const google_services_1 = require("../services/auth/google.services");
const discord_services_1 = require("../services/auth/discord.services");
const supabase_config_1 = __importDefault(require("../config/supabase.config"));
async function loginController(req, res) {
    const { email, password, method } = req.body;
    switch (method) {
        case 'email':
            try {
                const emailData = await (0, email_services_1.loginWithEmail)({ email, password });
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
            catch (error) {
                res.status(400).json({ error: error.message });
            }
            break;
        case 'discord':
            const discordData = await (0, discord_services_1.signInWithDiscord)();
            res.json({ discordData });
            break;
        case 'google':
            const googleData = await (0, google_services_1.signInWithGoogle)();
            res.json({ googleData });
            break;
        default:
            res.status(400).json({ error: 'Invalid login method' });
    }
}
async function signUpController(req, res) {
    const { email, password, method } = req.body;
    switch (method) {
        case 'email':
            const data = await (0, email_services_1.signUpWithEmail)({ email, password });
            if (data.user) {
                console.log("Creating profile and premium records for new user");
                const profileInsert = await supabase_config_1.default.from('profiles').insert({
                    email: email,
                    created_at: new Date().toISOString(),
                    last_login: new Date().toISOString(),
                    username: email.split('@')[0],
                    user_id: data?.user.id,
                    avatar_url: 'https://www.svgrepo.com/show/525577/user-circle.svg',
                    status: 'active',
                    is_premium: false
                });
                const premiumInsert = await supabase_config_1.default.from('premium').insert({
                    user_id: data?.user.id,
                    is_premium: false,
                    image_credits: 2,
                    kiss_coins: 50
                });
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
async function logoutController(req, res) {
    await (0, email_services_1.logout)();
    // Clear the auth cookies
    res.clearCookie('sb-access-token');
    res.clearCookie('sb-refresh-token');
    res.json({ message: 'Logged out successfully' });
}
