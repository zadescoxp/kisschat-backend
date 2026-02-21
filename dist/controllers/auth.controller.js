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
                    is_premium: false,
                    liked_characters: [],
                    bookmarked_characters: [],
                    favourite_characters: [],
                    bio: "",
                    referral_code: `${email.split('@')[0]}_KC26`
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
        // Send HTML that extracts tokens from hash and sends to backend
        const html = `<!DOCTYPE html>
<html>
<head><title>Completing sign in...</title></head>
<body>
<p>Completing sign in...</p>
<script>
console.log('Hash:', window.location.hash);
const hashParams = new URLSearchParams(window.location.hash.substring(1));
const accessToken = hashParams.get('access_token');
const refreshToken = hashParams.get('refresh_token');

console.log('Access Token:', accessToken ? 'present' : 'missing');
console.log('Refresh Token:', refreshToken ? 'present' : 'missing');

if (accessToken && refreshToken) {
    const url = window.location.origin + '/api/v1/auth/session';
    console.log('Posting to:', url);
    
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, refreshToken }),
        credentials: 'include'
    })
    .then(res => {
        console.log('Response status:', res.status);
        return res.json();
    })
    .then(data => {
        console.log('Response data:', data);
        if (data.success) {
            // Set tokens in frontend cookies
            document.cookie = 'sb-access-token=' + data.accessToken + '; path=/; max-age=3600; SameSite=Lax';
            document.cookie = 'sb-refresh-token=' + data.refreshToken + '; path=/; max-age=604800; SameSite=Lax';
            window.location.href = 'https://kisschat.ai/auth/callback';
        } else {
            alert('Error: ' + data.error);
            window.location.href = 'https://kisschat.ai/auth/login';
        }
    })
    .catch(err => {
        console.error('Fetch error:', err);
        alert('Request failed: ' + err.message);
    });
} else {
    alert('No tokens found in URL');
    console.error('Missing tokens');
}
</script>
</body>
</html>`;
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
        // Set the session and get user
        const { data, error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
        });
        if (setSessionError || !data.user) {
            console.error('Set session error:', setSessionError);
            return res.status(401).json({ success: false, error: 'Authentication failed' });
        }
        const user = data.user;
        console.log('OAuth user:', user.id, user.email);
        // Check if profile exists
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .limit(1)
            .single();
        if (!existingProfile) {
            console.log("Creating profile and premium records for new OAuth user");
            const username = user.email?.split('@')[0];
            const avatarUrl = user.user_metadata?.avatar_url ||
                user.user_metadata?.picture ||
                'https://www.svgrepo.com/show/525577/user-circle.svg';
            // Create profile
            const { error: profileError } = await supabase.from('profiles').insert({
                email: user.email,
                created_at: new Date().toISOString(),
                last_login: new Date().toISOString(),
                username: username,
                user_id: user.id,
                avatar_url: avatarUrl,
                status: 'active',
                is_premium: false,
                liked_characters: [],
                bookmarked_characters: [],
                favourite_characters: [],
                bio: "",
                referral_code: `${username}_KC26`
            });
            if (profileError)
                console.error('Profile insert error:', profileError);
            // Create premium record
            const { error: premiumError } = await supabase.from('premium').insert({
                user_id: user.id,
                is_premium: false,
                image_credits: 2,
                kiss_coins: 50
            });
            if (premiumError)
                console.error('Premium insert error:', premiumError);
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
            sameSite: "lax",
            maxAge: 60 * 60 * 1000
        });
        res.cookie("sb-refresh-token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        console.log('OAuth session established for user:', user.id);
        console.log('Setting cookies and responding to client');
        console.log('Access Token set in cookie:', accessToken);
        console.log('Refresh Token set in cookie:', refreshToken);
        res.json({ success: true, accessToken, refreshToken });
    }
    catch (error) {
        console.error('OAuth session error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
export async function forgotPasswordController(req, res) {
    await supabase.auth.resetPasswordForEmail(req.body.email, {
        redirectTo: 'https://kisschat.ai/update/password'
    });
    res.json({ message: 'Password reset email sent' });
}
export async function resetPasswordController(req, res) {
    const { accessToken, refreshToken, newPassword } = req.body;
    try {
        const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
        });
        if (sessionError)
            throw sessionError;
        const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword,
        });
        if (updateError)
            throw updateError;
        res.status(200).json({ message: 'Password updated successfully. You can now log in.' });
    }
    catch (error) {
        console.error('[API] Update password error:', error.message);
        res.status(401).json({ error: error.message });
    }
}
