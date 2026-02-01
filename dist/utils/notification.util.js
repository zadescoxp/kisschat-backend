import supabase from "../config/supabase.config.js";
import { getUserInfo } from "./user.util.js";
export async function sendUserInteractionNotification(body, recipientUserId, datetime, senderUserId) {
    const sender = await getUserInfo(senderUserId || '');
    // Fetch current notifications
    const { data: profileData, error: fetchError } = await supabase
        .from('profiles')
        .select('notification')
        .eq('user_id', recipientUserId)
        .limit(1)
        .maybeSingle();
    if (fetchError) {
        throw new Error(`Failed to fetch notifications: ${fetchError.message}`);
    }
    const currentNotifications = profileData?.notification || [];
    const newNotification = {
        profile_id: recipientUserId,
        subject_image: sender ? sender.avatar_url : '',
        subject: `${sender ? sender.username : 'Someone'}`,
        body: body,
        datetime: datetime,
        sender_user_id: senderUserId,
        sender_username: sender ? sender.username : '',
        is_read: false
    };
    const updatedNotifications = [...currentNotifications, newNotification];
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ notification: updatedNotifications })
        .eq('user_id', recipientUserId);
    if (updateError) {
        throw new Error('Failed to send notification');
    }
}
