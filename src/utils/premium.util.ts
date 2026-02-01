import { getUserInfo } from "./user.util.js";

export async function checkUserPremium(user_id: String) {
    try {
        const data = await getUserInfo(user_id as string);

        if (!data) {
            return false;
        }

        return data.is_premium;
    } catch (error) {
        return false;
    }
}