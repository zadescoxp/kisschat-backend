import { loginWithEmail, logout, signUpWithEmail } from "../services/auth/email.services.js";
import { signInWithGoogle } from "../services/auth/google.services.js";
import { signInWithDiscord } from "../services/auth/discord.services.js";
import supabase from "../config/supabase.config.js";
import { signInWithX } from "../services/auth/x.services.js";
export async function loginController(req, res) {
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
            catch (error) {
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
        case 'x':
            const xData = await signInWithX();
            res.json({ xData });
            break;
        default:
            res.status(400).json({ error: 'Invalid login method' });
    }
}
export async function signUpController(req, res) {
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
                });
                const premiumInsert = await supabase.from('premium').insert({
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
export async function logoutController(req, res) {
    await logout();
    // Clear the auth cookies
    res.clearCookie('sb-access-token');
    res.clearCookie('sb-refresh-token');
    res.json({ message: 'Logged out successfully' });
}
export async function oauthCallbackController(req, res) {
    try {
        // Supabase sends tokens in hash fragment, we need to handle this differently
        // Send an HTML page that extracts hash and sends to backend
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Completing sign in...</title>
        </head>
        <body>
            <p>Completing sign in...</p>
            <script>
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const accessToken = hashParams.get('access_token');
                const refreshToken = hashParams.get('refresh_token');
                
                if (accessToken && refreshToken) {
                    // Send tokens to backend via POST
                    fetch('${process.env.BACKEND_URL}/auth/session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ accessToken, refreshToken }),
                        credentials: 'include'
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            window.location.href = 'https://kisschat-ai.vercel.app/dashboard';
                        } else {
                            window.location.href = 'https://kisschat-ai.vercel.app/error?message=' + encodeURIComponent(data.error);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        window.location.href = 'https://kisschat-ai.vercel.app/error?message=Authentication failed';
                    });
                } else {
                    window.location.href = 'https://kisschat-ai.vercel.app/error?message=No tokens received';
                }
            </script>
        </body>
        </html>
        `;
        res.send(html);
    }
    catch (error) {
        console.error('OAuth callback error:', error);
        res.status(500).json({ error: error.message });
    }
}
export async function oauthSessionController(req, res) {
    try {
        const { accessToken, refreshToken } = req.body;
        if (!accessToken || !refreshToken) {
            return res.status(400).json({ success: false, error: 'Missing tokens' });
        }
        // Set the session using the tokens
        const { data: { user }, error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
        });
        if (setSessionError || !user) {
            console.error('Set session error:', setSessionError);
            return res.status(401).json({ success: false, error: 'Authentication failed' });
        }
        // Check if profile exists
        const { data: existingProfile, error: profileCheckError } = await supabase
            .from('profiles')
            .select('user_id')
            .eq('user_id', user.id)
            .single();
        // If profile doesn't exist, create it (new user)
        if (!existingProfile) {
            console.log("Creating profile and premium records for new OAuth user");
            const username = user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                user.email?.split('@')[0] ||
                'user';
            const avatarUrl = user.user_metadata?.avatar_url ||
                user.user_metadata?.picture ||
                'https://www.svgrepo.com/show/525577/user-circle.svg';
            // Create profile
            await supabase.from('profiles').insert({
                email: user.email,
                created_at: new Date().toISOString(),
                last_login: new Date().toISOString(),
                username: username,
                user_id: user.id,
                avatar_url: avatarUrl,
                status: 'active',
                is_premium: false
            });
            // Create premium record
            await supabase.from('premium').insert({
                user_id: user.id,
                is_premium: false,
                image_credits: 2,
                kiss_coins: 50
            });
        }
        else {
            // Update last_login for existing users
            await supabase.from('profiles').update({
                last_login: new Date().toISOString()
            }).eq('user_id', user.id);
        }
        // Set auth cookies
        res.cookie("sb-access-token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000 // 1 hour
        });
        res.cookie("sb-refresh-token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.json({ success: true });
    }
    catch (error) {
        console.error('OAuth callback error:', error);
        res.status(500).json({ error: error.message });
    }
}
