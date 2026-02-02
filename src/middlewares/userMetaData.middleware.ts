import { Request, Response, NextFunction } from "express";
import supabase from "../config/supabase.config.js";

declare global {
    namespace Express {
        interface Request {
            userProfile?: any;        // profile data from Supabase
        }
    }
}

export async function userMetaDataMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", req.user?.id)
            .limit(1)
            .single();

        if (error) {
            return res.status(500).json({ error: "Failed to fetch user metadata" });
        }

        req.userProfile = data; // 🔥 attach to request
        next();
    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
}