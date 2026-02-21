interface PaymentFailedTemplateData {
    username: string;
    trackId: string;
    amount: number;
    description: string;
}

export function paymentFailedTemplate(data: PaymentFailedTemplateData): string {
    return baseTemplate(`
<tr><td align="center" style="font-size:28px;font-weight:800;color:#ff4d4d;">
Payment Failed
</td></tr>

<tr><td style="padding:10px 30px 25px;color:#999;" align="center">
Hi ${data.username}, we couldn’t process your payment.
</td></tr>

<tr><td style="background:rgba(20,20,20,0.6);border-radius:14px;padding:25px;color:#b0b0b0;font-size:15px;line-height:1.7;">

<strong style="color:white;">Transaction ID:</strong> ${data.trackId}<br>
<strong style="color:white;">Amount:</strong> $${data.amount}<br>
<strong style="color:white;">Details:</strong> ${data.description}

<br><br>Please try again.

</td></tr>

<tr><td align="center" style="padding:30px 0;">
<a href="https://kisschat.ai/pricing" style="
background: linear-gradient(95deg,#F60000,#C7290A,#C412DB);
padding:14px 40px;border-radius:14px;color:white;text-decoration:none;font-weight:700;">
Retry Payment
</a>
</td></tr>
`);
}