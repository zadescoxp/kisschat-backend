import { Request, Response } from "express";
import planAmount from "../utils/plan.util.js";

export async function handlePaymentCallbackController(req: Request, res: Response) {
    res.json({ message: "Payment callback received" });
}

export async function initiatePaymentController(req: Request, res: Response) {
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
            callback_url: `${process.env.PROD_BACKEND_URL}/payment/callback`,
            "return_url": "https://kisschat-ai.vercel.app",
            thanks_message: "Thanks a lot for your purchase. Enjoy your subscription to the fullest.",
            sandbox: false
        })
    });

    const data = await response.json();

    if (!response.ok) {
        return res.status(500).json({ message: "Failed to initiate payment", error: data });
    }

    res.json({ message: data });
}