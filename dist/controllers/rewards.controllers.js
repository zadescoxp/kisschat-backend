import supabase from "../config/supabase.config.js";
import { rewardsAmount } from "../constants/rewards.js";
async function checkRewardClaim(user_id) {
    // const user_id = req.user?.id;
    if (!user_id) {
        return {
            canClaim: false,
            message: "User not authenticated"
        };
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
                return {
                    canClaim: false,
                    message: insertError.message
                };
            }
            return {
                canClaim: true,
                day: 1,
                message: "User can claim the reward"
            };
        }
        const lastClaimedAt = new Date(data.last_claim_at);
        const now = new Date();
        const timeDifference = now.getTime() - lastClaimedAt.getTime();
        const hoursDifference = timeDifference / (1000 * 60 * 60);
        console.log(`Last claimed at: ${lastClaimedAt}`);
        console.log(`Current time: ${now}`);
        console.log(`Time since last claim: ${hoursDifference} hours`);
        if (hoursDifference >= 24) {
            if (data.streak >= 7 || hoursDifference >= 48) {
                await supabase.from("daily_rewards").update({
                    streak: 1,
                    last_claim_at: new Date()
                }).eq("user_id", user_id);
                return {
                    canClaim: true,
                    day: 1,
                    message: "User can claim the reward"
                };
            }
            else {
                await supabase.from("daily_rewards").update({
                    streak: data.streak + 1,
                    last_claim_at: new Date()
                }).eq("user_id", user_id);
                return {
                    canClaim: true,
                    day: data.streak + 1,
                    message: "User can claim the reward"
                };
            }
        }
        else {
            return {
                canClaim: false,
                day: data.streak,
                message: "User has already claimed the reward within the last 24 hours"
            };
        }
    }
    catch (error) {
        return {
            canClaim: false,
            message: error.message
        };
    }
}
export async function getRewards(req, res) {
    const rewardCheck = await checkRewardClaim(req.user?.id || '');
    if (!rewardCheck.canClaim) {
        return res.status(400).json({
            message: rewardCheck.message
        });
    }
    // const { day } = req.body
    const day = rewardCheck.day;
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
        console.log(`Rewarding user ${user_id} with ${amount} kiss coins for day ${day} streak.`);
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
