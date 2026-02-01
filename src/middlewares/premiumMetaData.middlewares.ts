import { Request, Response, NextFunction } from "express";
import supabase from "../config/supabase.config.js";

declare global {
    namespace Express {
        interface Request {
            premiumMetaData?: any;        // premium data from Supabase
        }
    }
}

export async function premiumMetaDataMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { data, error } = await supabase
            .from("premium")
            .select("*")
            .eq("user_id", req.user?.id)
            .single();

        if (error) {
            return res.status(500).json({ error: "Failed to fetch premium metadata" });
        }

        req.premiumMetaData = data;
        next();
    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
}