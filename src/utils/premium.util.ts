import supabase from "../config/supabase.config.js";

export async function checkUserPremium(user_id: String) {
    try {
        const { data, error } = await supabase.from("premium").select("*")
            .eq("user_id", user_id)
            .single();

        if (error) {
            return false;
        }

        const currentDate = new Date();
        const premiumExpiryDate = new Date(data.expire_at);

        return {
            isPremium: premiumExpiryDate > currentDate,
            plan: data.plan_subscribed,
        }

    } catch (error) {
        return false;
    }
}

export async function validatePremiumSelection(plan: string, duration: number, user_id: string) {

    const validPlans = ['basic', 'pro', 'deluxe'];
    const validDurations = [1, 6, 12];

    if (!validPlans.includes(plan)) {
        return {
            valid: false,
            message: "Invalid plan selected."
        }
    }

    if (!validDurations.includes(duration)) {
        return {
            valid: false,
            message: "Invalid duration selected."
        }
    }

    const userPremiumData = await checkUserPremium(user_id);

    if (userPremiumData && userPremiumData.isPremium) {
        if (userPremiumData.plan === plan) {
            return {
                valid: false,
                message: "You are already subscribed to this plan."
            }
        }
        if (userPremiumData.plan === 'deluxe' && plan !== 'deluxe') {
            return {
                valid: false,
                message: "You cannot downgrade from Deluxe plan."
            }
        }
        if (userPremiumData.plan === 'pro' && plan === 'basic') {
            return {
                valid: false,
                message: "You cannot downgrade from Pro plan to Basic plan."
            }
        }
    }
    return {
        valid: true,
        message: "Valid selection."
    };
}