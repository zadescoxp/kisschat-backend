import supabase from "../config/supabase.config.js";
import { rewardsAmount } from "../constants/rewards.js";
export async function checkRewardClaim(req, res) {
    const user_id = req.user?.id;
    if (!user_id) {
        return res.status(200).json({
            canClaim: false,
            message: "User not authenticated"
        });
    }
    try {
        const { data } = await supabase.from("daily_rewards").select("*").eq("user_id", user_id).single();
        if (!data) {
            console.log("No data found, inserting new record");
            const { error: insertError } = await supabase.from("daily_rewards").insert({
                user_id: user_id,
                streak: 1,
                updated_at: new Date()
            });
            if (insertError) {
                return res.status(500).json({
                    canClaim: false,
                    message: insertError.message
                });
            }
            return res.status(200).json({
                canClaim: true,
                day: 1,
                message: "User can claim the reward"
            });
        }
        const lastClaimedAt = new Date(data.last_claim_at);
        const now = new Date();
        const timeDifference = now.getTime() - lastClaimedAt.getTime();
        const hoursDifference = timeDifference / (1000 * 60 * 60);
        if (hoursDifference >= 24) {
            if (data.streak >= 7 || hoursDifference >= 48) {
                await supabase.from("daily_rewards").update({
                    streak: 1,
                    last_claim_at: new Date()
                }).eq("user_id", user_id);
                return res.status(200).json({
                    canClaim: true,
                    day: 1,
                    message: "User can claim the reward"
                });
            }
            else {
                await supabase.from("daily_rewards").update({
                    streak: data.streak + 1,
                    last_claim_at: new Date()
                }).eq("user_id", user_id);
                return res.status(200).json({
                    canClaim: true,
                    day: data.streak + 1,
                    message: "User can claim the reward"
                });
            }
        }
        else {
            return res.status(200).json({
                canClaim: false,
                day: data.streak,
                message: "User has already claimed the reward within the last 24 hours"
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            canClaim: false,
            message: error.message
        });
    }
}
export async function getRewards(req, res) {
    const { day } = req.body;
    const amount = rewardsAmount.find(reward => reward.day === parseInt(day))?.amount;
    const user_id = req.user?.id;
    const { data, error } = await supabase.from("daily_rewards").select("*").eq("user_id", user_id).single();
    if (error) {
        return res.status(500).json({
            message: error.message
        });
    }
    if (amount) {
        if (data.streak !== parseInt(day)) {
            return res.status(400).json({
                message: "Invalid reward claim. Streak day does not match the requested reward day."
            });
        }
        await supabase.rpc("increment_kiss_coins", {
            user_id,
            p_amount: amount
        });
        await supabase.from("daily_rewards").update({
            last_claim_at: new Date()
        }).eq("user_id", user_id);
        return res.status(200).json({
            day: parseInt(day),
            amount: amount
        });
    }
    else {
        return res.status(404).json({
            message: "Reward not found for the specified day"
        });
    }
}
