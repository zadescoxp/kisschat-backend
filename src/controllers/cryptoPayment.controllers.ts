import { Request, Response } from "express";
import planAmount from "../utils/plan.util.js";
import supabase from "../config/supabase.config.js";
import crypto from "crypto";
import { basic_kiss_coins, deluxe_kiss_coins, pro_kiss_coins } from "../constants/premium.js";
import { validatePremiumSelection } from "../utils/premium.util.js";
import { coinAmount } from "../utils/kisscoin.util.js";

export async function handleCryptoPaymentCallbackController(req: Request, res: Response) {
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

    const user_id = data.order_id;

    const { error } = await supabase
        .from('payments')
        .update({ status: data.status, details: data })
        .eq('track_id', data.track_id);

    if (error) {
        return res.status(500).send('Internal server error');
    }

    if (data.status === 'Expired') {
        return res.status(200).send('ok');
    } else if (data.status === 'Underpaid') {
        return res.status(200).send('ok');
    } else if (data.status === 'Failed') {
        return res.status(200).send('ok');
    } else if (data.status === 'Cancelled') {
        return res.status(200).send('ok');
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
        } else if (plan === 'pro') {
            coinsToAdd = pro_kiss_coins;
        } else if (plan === 'deluxe') {
            coinsToAdd = deluxe_kiss_coins;
        } else {
            coinsToAdd = 0;
        }

        console.log(`Adding ${coinsToAdd} kiss coins to user ${user_id}`);

        const { error: coinsError } = await supabase
            .rpc('increment_kiss_coins', {
                user_id,
                amount: coinsToAdd
            });

        if (coinsError) {
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
            return res.status(500).send('Internal server error');
        }

        const { error: profileError } = await supabase
            .from('profiles')
            .update({ is_premium: true })
            .eq('user_id', user_id);

        if (profileError) {
            return res.status(500).send('Internal server error');
        }
    }

    return res.status(200).send('ok');
}

export async function handleKissCoinsCryptoPaymentCallbackController(req: Request, res: Response) {
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

    const user_id = data.order_id;

    const { error } = await supabase
        .from('payments')
        .update({ status: data.status, details: data })
        .eq('track_id', data.track_id);

    if (error) {
        return res.status(500).send('Internal server error');
    }

    if (data.status === 'Expired') {
        return res.status(200).send('ok');
    } else if (data.status === 'Underpaid') {
        return res.status(200).send('ok');
    } else if (data.status === 'Failed') {
        return res.status(200).send('ok');
    } else if (data.status === 'Cancelled') {
        return res.status(200).send('ok');
    }

    if (data.status === 'Paid') {

        // Retrieve payment details from database to get the kiss coins
        const { data: paymentData, error: paymentError } = await supabase
            .from('payments')
            .select('kiss_coins')
            .eq('track_id', data.track_id)
            .single();

        if (paymentError || !paymentData) {
            console.error('Supabase payment fetch error:', paymentError);
            return res.status(500).send('Internal server error');
        }

        const { kiss_coins } = paymentData;

        console.log(`Adding ${kiss_coins} kiss coins to user ${user_id}`);

        const { error: coinsError } = await supabase
            .rpc('increment_kiss_coins', {
                user_id,
                amount: kiss_coins
            });

        if (coinsError) {
            console.error('Error adding kiss coins:', coinsError);
            return res.status(500).send('Internal server error');
        }
    }

    return res.status(200).send('ok');
}

export async function initiateCryptoPaymentController(req: Request, res: Response) {
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

    if (!response.ok) {
        return res.status(500).json({ message: "Failed to initiate payment" });
    }

    const data = await response.json();

    const { error } = await supabase.from('payments').insert(
        {
            id: req.user?.id,
            plan: plan,
            duration: duration,
            amount: amount,
            track_id: data.data.track_id,
            status: 'Pending',
            payment_url: data.data.payment_url,
            method: 'crypto',
            is_kiss_coins_purchase: false
        }
    );

    if (error) {
        return res.status(500).json({ message: "Failed to update the payment table", error });
    }

    res.json({ message: data });
}

export async function initiateKissCoinsCryptoPaymentController(req: Request, res: Response) {
    const { kisscoins } = req.body;
    if (!kisscoins || kisscoins <= 0) {
        return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const amount = coinAmount(kisscoins);

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
            description: `Purchase of ${kisscoins} kiss coins`,
            callback_url: `${process.env.PROD_BACKEND_URL}/payment/crypto/kiss-coins/webhook`,
            "return_url": "https://kisschat-ai.vercel.app",
            thanks_message: "Thanks a lot for your purchase. Enjoy your kiss coins to the fullest.",
            sandbox: true,
            order_id: req.user?.id
        })
    });

    if (!response.ok) {
        return res.status(500).json({ message: "Failed to initiate payment" });
    }

    const data = await response.json();

    const { error } = await supabase.from('payments').insert(
        {
            id: req.user?.id,
            amount: amount,
            kiss_coins: kisscoins,
            track_id: data.data.track_id,
            status: 'Pending',
            payment_url: data.data.payment_url,
            method: 'crypto',
            is_kiss_coins_purchase: true
        }
    );

    if (error) {
        return res.status(500).json({ message: "Failed to update the payment table", error });
    }

    res.json({ message: data });
}

export async function getPaymentHistoryController(req: Request, res: Response) {
    const user_id = req.user?.id;

    const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', user_id)
        .order('created_at', { ascending: false });

    if (error) {
        return res.status(500).json({ message: "Failed to fetch payment history", error });
    }

    res.json({ payments: data });
}