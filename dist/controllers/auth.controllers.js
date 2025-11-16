"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = loginController;
exports.signUpController = signUpController;
exports.logoutController = logoutController;
const email_services_1 = require("../services/auth/email.services");
const google_services_1 = require("../services/auth/google.services");
const discord_services_1 = require("../services/auth/discord.services");
async function loginController(req, res) {
    const { email, password, method } = req.body;
    switch (method) {
        case 'email':
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
            break;
        case 'discord':
            const discordData = await (0, discord_services_1.signInWithDiscord)();
            break;
        case 'google':
            const googleData = await (0, google_services_1.signInWithGoogle)();
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
