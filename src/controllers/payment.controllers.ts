import { Request, Response } from "express";
import planAmount from "../utils/plan.util.js";
import supabase from "../config/supabase.config.js";
import crypto from "crypto";

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
    console.log(data);

    return res.status(200).send('ok');
}

export async function initiateCryptoPaymentController(req: Request, res: Response) {
    const { plan, duration } = req.body;
    if (!plan || !duration) {
        return res.status(400).json({ message: "Plan and duration are required" });
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
            description: `Payment for ${plan} plan for ${duration} months`,
            callback_url: `${process.env.PROD_BACKEND_URL}/payment/crypto/webhook`,
            "return_url": "https://kisschat-ai.vercel.app",
            thanks_message: "Thanks a lot for your purchase. Enjoy your subscription to the fullest.",
            sandbox: true
        })
    });

    const data = await response.json();

    const { error } = await supabase.from('payments').insert(
        {
            id: req.user?.id,
            plan: plan,
            duration: duration,
            amount: amount,
            track_id: data.data.track_id,
            status: 'pending',
            payment_url: data.data.payment_url,
            method: 'crypto',
        }
    );

    if (error) {
        console.error('Supabase insert error:', error);
    }

    if (!response.ok) {
        return res.status(500).json({ message: "Failed to initiate payment", error: data });
    }

    res.json({ message: data });
}