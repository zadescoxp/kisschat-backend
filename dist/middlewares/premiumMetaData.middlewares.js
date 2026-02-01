import supabase from "../config/supabase.config.js";
export async function premiumMetaDataMiddleware(req, res, next) {
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
    }
    catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
}
