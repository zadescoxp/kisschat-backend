"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthMiddleware = verifyAuthMiddleware;
const supabase_config_1 = __importDefault(require("../config/supabase.config"));
async function verifyAuthMiddleware(req, res, next) {
    try {
        const accessToken = req.cookies['sb-access-token'] || req.headers.authorization?.split(' ')[1];
        const refreshToken = req.cookies['sb-refresh-token'];
        if (!accessToken) {
            return res.status(401).json({ error: 'No access token provided' });
        }
        // Verify the access token with Supabase
        const { data: { user }, error } = await supabase_config_1.default.auth.getUser(accessToken);
        if (error) {
            // Token is invalid or expired, try to refresh
            if (refreshToken) {
                try {
                    const { data: refreshData, error: refreshError } = await supabase_config_1.default.auth.refreshSession({
                        refresh_token: refreshToken
                    });
                    if (refreshError || !refreshData.session) {
                        return res.status(401).json({ error: 'Session expired. Please login again.' });
                    }
                    // Update cookies with new tokens
                    res.cookie('sb-access-token', refreshData.session.access_token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 60 * 60 * 1000 // 1 hour
                    });
                    res.cookie('sb-refresh-token', refreshData.session.refresh_token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                    });
                    // Attach user to request
                    req.user = refreshData.user;
                    return next();
                }
                catch (refreshErr) {
                    return res.status(401).json({ error: 'Failed to refresh token. Please login again.' });
                }
            }
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        // Token is valid, attach user to request
        req.user = user;
        next();
    }
    catch (err) {
        console.error('Auth verification error:', err);
        return res.status(500).json({ error: 'Internal server error during authentication' });
    }
}
