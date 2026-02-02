import supabase from "../config/supabase.config.js";
export async function userMetaDataMiddleware(req, res, next) {
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
    }
    catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
}
