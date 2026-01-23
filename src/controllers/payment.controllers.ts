import { Request, Response } from "express";

export async function handlePaymentCallback(req: Request, res: Response) {
    // Logic to handle payment gateway callback
    res.json({ message: "Payment callback received" });
}