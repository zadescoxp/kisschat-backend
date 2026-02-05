import supabase from "../config/supabase.config.js";
import { activity } from "../constants/referral.js";
// STEP 1. Check if referral code exists
async function checkReferralCode(referral_code) {
    const { data, error } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('referral_code', referral_code)
        .limit(1)
        .maybeSingle();
    if (error) {
        throw new Error("Database query failed");
    }
    return data;
}
// STEP 2. Check if the user has already used a referral code
async function checkActivityUsed(referred_user_id, activity) {
    const { data, error } = await supabase
        .from('referral')
        .select('*')
        .eq('referred_user_id', referred_user_id)
        .eq('activity', activity)
        .limit(1)
        .maybeSingle();
    if (error) {
        throw new Error("Database query failed");
    }
    return data;
}
// STEP 3. Record the referral
async function recordReferral(referrer_user_id, referred_user_id, referral_code, activity, kiss_coins) {
    const { error } = await supabase
        .from('referral')
        .insert({
        referrer_user_id,
        referred_user_id,
        referral_code,
        activity,
        kiss_coins
    });
    if (error) {
        throw new Error("Failed to record referral");
    }
    const { error: updateError } = await supabase
        .rpc('increment_kiss_coins', {
        user_id: referrer_user_id,
        amount: kiss_coins
    });
    if (updateError) {
        throw new Error(updateError.message);
    }
}
// STEP 4. Final function to handle referral process
async function handleReferral(referral_code, code, referred_user_id) {
    const referralData = await checkReferralCode(referral_code);
    if (!referralData) {
        throw new Error("Invalid referral code");
    }
    const activityData = await checkActivityUsed(referred_user_id, activity[code].activity);
    if (activityData) {
        throw new Error("Referral code already used for this activity");
    }
    await recordReferral(referralData.user_id, referred_user_id, referral_code, activity[code].activity, activity[code].points);
}
export { handleReferral };
