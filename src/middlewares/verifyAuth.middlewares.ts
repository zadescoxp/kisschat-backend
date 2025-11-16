import { Request, Response, NextFunction } from "express";
import supabase from "../config/supabase.config";

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email?: string;
                [key: string]: any;
            };
        }
    }
}

export async function verifyAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const accessToken = req.cookies['sb-access-token'] || req.headers.authorization?.split(' ')[1];
        const refreshToken = req.cookies['sb-refresh-token'];

        if (!accessToken) {
            return res.status(401).json({ error: 'No access token provided' });
        }

        // Verify the access token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(accessToken);

        if (error) {
            // Token is invalid or expired, try to refresh
            if (refreshToken) {
                try {
                    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
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
                    req.user = refreshData.user as any;

                    return next();
                } catch (refreshErr) {
                    return res.status(401).json({ error: 'Failed to refresh token. Please login again.' });
                }
            }

            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // Token is valid, attach user to request
        req.user = user as any;
        next();
    } catch (err) {
        console.error('Auth verification error:', err);
        return res.status(500).json({ error: 'Internal server error during authentication' });
    }
}