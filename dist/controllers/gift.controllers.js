import supabase from "../config/supabase.config.js";
import { deductChatKissCoins } from "../utils/kisscoin.util.js";
export async function giveGiftController(req, res) {
    try {
        const { character_id, gift, kiss_coins } = req.body;
        if (!character_id || !gift || !kiss_coins) {
            return res.status(400).json({ error: "Missing required fields: 'character_id', 'gift', and 'kiss_coins' are all required." });
        }
        await deductChatKissCoins(req.user?.id || '', kiss_coins);
        const { error } = await supabase.from('gifts').insert({
            character_id,
            user_id: req.user?.id,
            gift,
            kiss_coins
        });
        if (error) {
            console.error("Supabase error in giveGiftController:", error);
            return res.status(500).json({ error: "Failed to record the gift transaction." });
        }
        res.json({ message: `You gifted ${gift} successfully` });
    }
    catch (error) {
        console.error("Error in giveGiftController:", error);
        res.status(500).json({ error: "An error occurred while processing the request." });
    }
}
