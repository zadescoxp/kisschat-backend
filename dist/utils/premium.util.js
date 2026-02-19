import supabase from "../config/supabase.config.js";
export async function checkUserPremium(user_id) {
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
        };
    }
    catch (error) {
        return false;
    }
}
export async function validatePremiumSelection(plan, duration, user_id) {
    const validPlans = ['spark', 'ember', 'inferno', 'basic', 'pro', 'deluxe']; // Support both new and legacy names
    const validDurations = [1, 6, 12];
    // Normalize plan name to lowercase
    const normalizedPlan = plan.toLowerCase();
    if (!validPlans.includes(normalizedPlan)) {
        return {
            valid: false,
            message: "Invalid plan selected."
        };
    }
    if (!validDurations.includes(duration)) {
        return {
            valid: false,
            message: "Invalid duration selected."
        };
    }
    const userPremiumData = await checkUserPremium(user_id);
    if (userPremiumData && userPremiumData.isPremium) {
        const currentPlan = userPremiumData.plan?.toLowerCase();
        // Map legacy names to new names for comparison
        const planMapping = {
            'basic': 'spark',
            'pro': 'ember',
            'deluxe': 'inferno',
            'spark': 'spark',
            'ember': 'ember',
            'inferno': 'inferno'
        };
        const mappedCurrentPlan = planMapping[currentPlan] || currentPlan;
        const mappedNewPlan = planMapping[normalizedPlan] || normalizedPlan;
        if (mappedCurrentPlan === mappedNewPlan) {
            return {
                valid: false,
                message: "You are already subscribed to this plan."
            };
        }
        // Prevent downgrades
        if ((mappedCurrentPlan === 'inferno') && mappedNewPlan !== 'inferno') {
            return {
                valid: false,
                message: "You cannot downgrade from Inferno plan."
            };
        }
        if ((mappedCurrentPlan === 'ember') && mappedNewPlan === 'spark') {
            return {
                valid: false,
                message: "You cannot downgrade from Ember plan to Spark plan."
            };
        }
    }
    return {
        valid: true,
        message: "Valid selection."
    };
}
