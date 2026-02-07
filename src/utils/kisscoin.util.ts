import supabase from "../config/supabase.config.js";
import { coins100, coins2400, coins5000, coins550, image_base_coins, max_creativity_coins, max_details_coins, max_image_coins, ultra_image_coins } from "../constants/coins.js";

export async function deductChatKissCoins(user_id: string, amount: number): Promise<{ success: boolean; error?: string }> {
    const { data, error } = await supabase
        .rpc('decrement_kiss_coins', {
            user_id,
            amount
        });

    if (error) {
        return { success: false, error: 'Failed to deduct kiss coins.' };
    }

    if (!data) {
        return { success: false, error: 'Insufficient kiss coins.' };
    }

    return { success: true };
}

interface ImageDetails {
    quality?: 'Max' | 'Ultra';
    details?: number;
    creativity?: number;
}

export async function rateImageKissCoins(details: ImageDetails) {
    let amount = image_base_coins;

    if (details['quality'] === 'Ultra') {
        amount += ultra_image_coins;
    } else if (details['quality'] === 'Max') {
        amount += max_image_coins;
    }

    if (details['details']) {
        if (details['details'] > 1) {
            amount += max_details_coins;
        }
    }
    if (details['creativity']) {
        if (details['creativity'] > 30) {
            amount += max_creativity_coins;
        }
    }
    return amount;
}

export async function deductImageKissCoins(user_id: string, details: ImageDetails): Promise<{ success: boolean; error?: string; kisscoins_used?: number }> {

    const amount = await rateImageKissCoins(details);

    const { data, error } = await supabase
        .rpc('decrement_kiss_coins', {
            user_id,
            amount
        });

    if (error) {
        return { success: false, error: 'Failed to deduct kiss coins.' };
    }

    if (!data) {
        return { success: false, error: 'Insufficient kiss coins.' };
    }

    return { success: true, kisscoins_used: amount };
}

export function coinAmount(kisscoins: number) {
    switch (kisscoins) {
        case 100:
            return coins100;
        case 550:
            return coins550;
        case 2400:
            return coins2400;
        case 5000:
            return coins5000;
        default:
            throw new Error('Invalid kiss coin amount');
    }
}