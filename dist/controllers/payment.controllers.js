import planAmount from "../utils/plan.util.js";
import supabase from "../config/supabase.config.js";
import crypto from "crypto";
import { basic_kiss_coins, deluxe_kiss_coins, pro_kiss_coins } from "../constants/premium.js";
import { validatePremiumSelection } from "../utils/premium.util.js";
export async function handleCryptoPaymentCallbackController(req, res) {
    const rawBody = JSON.stringify(req.body);
    const incomingHmac = req.headers['hmac'];
    const secret = process.env.OXAPAY_API_KEY || '';
    // Validate HMAC signature
    const expectedHmac = crypto
        .createHmac('sha512', secret)
        .update(rawBody)
        .digest('hex');
    if (expectedHmac !== incomingHmac) {
        return res.status(400).send('Invalid signature');
    }
    const data = req.body;
    console.log(data);
    const user_id = data.order_id;
    const { error } = await supabase
        .from('payments')
        .update({ status: data.status, details: data })
        .eq('track_id', data.track_id);
    if (error) {
        console.error('Supabase update error:', error);
        return res.status(500).send('Internal server error');
    }
    if (data.status === 'Paid') {
        // Retrieve payment details from database to get plan and duration
        const { data: paymentData, error: paymentError } = await supabase
            .from('payments')
            .select('plan, duration')
            .eq('track_id', data.track_id)
            .single();
        if (paymentError || !paymentData) {
            console.error('Supabase payment fetch error:', paymentError);
            return res.status(500).send('Internal server error');
        }
        const { plan, duration } = paymentData;
        let coinsToAdd;
        if (plan === 'basic') {
            coinsToAdd = basic_kiss_coins;
        }
        else if (plan === 'pro') {
            coinsToAdd = pro_kiss_coins;
        }
        else if (plan === 'deluxe') {
            coinsToAdd = deluxe_kiss_coins;
        }
        else {
            coinsToAdd = 0;
        }
        console.log(`Adding ${coinsToAdd} kiss coins to user ${user_id}`);
        const { error: coinsError } = await supabase
            .rpc('increment_kiss_coins', {
            user_id,
            amount: coinsToAdd
        });
        if (coinsError) {
            console.error('Supabase kiss coins increment error:', coinsError);
            return res.status(500).send('Internal server error');
        }
        const expireDate = new Date();
        expireDate.setMonth(expireDate.getMonth() + duration);
        const { error } = await supabase
            .from('premium')
            .update({
            is_premium: true,
            payment_method: 'crypto',
            amount_paid: data.amount,
            plan_subscribed: plan,
            paid_at: new Date().toISOString(),
            expire_at: expireDate.toISOString()
        })
            .eq('user_id', user_id);
        if (error) {
            console.error('Supabase kiss coins update error:', error);
            return res.status(500).send('Internal server error');
        }
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ is_premium: true })
            .eq('user_id', user_id);
        if (profileError) {
            console.error('Supabase profile update error:', profileError);
            return res.status(500).send('Internal server error');
        }
    }
    return res.status(200).send('ok');
}
export async function initiateCryptoPaymentController(req, res) {
    const { plan, duration } = req.body;
    if (!plan || !duration) {
        return res.status(400).json({ message: "Plan and duration are required" });
    }
    const validatePremium = await validatePremiumSelection(plan, duration, req.user?.id || '');
    if (!validatePremium.valid) {
        return res.status(400).json({ message: validatePremium.message });
    }
    const amount = planAmount(plan, duration);
    if (amount <= 0) {
        return res.status(400).json({ message: "Invalid plan or duration" });
    }
    const response = await fetch(`${process.env.OXAPAY_PAYMENT_URL}/payment/invoice`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'merchant_api_key': `${process.env.OXAPAY_API_KEY}`
        },
        body: JSON.stringify({
            amount: amount,
            lifetime: 15,
            fee_paid_by_payer: 1,
            under_paid_coverage: 0,
            auto_withdrawal: 1,
            description: `${plan} for ${duration} months`,
            callback_url: `${process.env.PROD_BACKEND_URL}/payment/crypto/webhook`,
            "return_url": "https://kisschat-ai.vercel.app",
            thanks_message: "Thanks a lot for your purchase. Enjoy your subscription to the fullest.",
            sandbox: true,
            order_id: req.user?.id
        })
    });
    const data = await response.json();
    const { error } = await supabase.from('payments').insert({
        id: req.user?.id,
        plan: plan,
        duration: duration,
        amount: amount,
        track_id: data.data.track_id,
        status: 'Pending',
        payment_url: data.data.payment_url,
        method: 'crypto',
    });
    if (error) {
        console.error('Supabase insert error:', error);
    }
    if (!response.ok) {
        return res.status(500).json({ message: "Failed to initiate payment", error: data });
    }
    res.json({ message: data });
}
