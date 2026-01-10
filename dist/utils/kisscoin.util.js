import supabase from "../config/supabase.config.js";
export async function deductKissCoins(user_id, amount) {
    const { data, error } = await supabase
        .from('premium')
        .select('kiss_coins')
        .eq('user_id', user_id)
        .single();
    if (error) {
        return { success: false, error: 'Failed to retrieve user data.' };
    }
    if (data.kiss_coins < amount) {
        return { success: false, error: 'Insufficient kiss coins.' };
    }
    const { error: updateError } = await supabase
        .from('premium')
        .update({ kiss_coins: data.kiss_coins - amount })
        .eq('user_id', user_id);
    if (updateError) {
        return { success: false, error: 'Failed to deduct kiss coins.' };
    }
    return { success: true };
}
