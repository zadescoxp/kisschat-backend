import { baseTemplate } from './baseEmail.template.js';
export function paymentSuccessTemplate(data) {
    return baseTemplate(`
<tr><td align="center" style="font-size:28px;font-weight:800;">
🎉 Payment Successful
</td></tr>

<tr><td style="padding:10px 30px 25px;color:#999;" align="center">
Hi ${data.username}, your payment was successful ✨
</td></tr>

<tr><td style="background:rgba(20,20,20,0.6);border-radius:14px;padding:25px;color:#b0b0b0;font-size:15px;line-height:1.7;">

<strong style="color:white;">Transaction ID:</strong> ${data.trackId}<br>
<strong style="color:white;">Amount Paid:</strong> $${data.amount}<br>
<strong style="color:white;">Plan:</strong> ${data.plan}<br>
<strong style="color:white;">Duration:</strong> ${data.duration} month(s)<br>
<strong style="color:white;">Coins Added:</strong> ${data.coinsAdded}<br>
<strong style="color:white;">Expires On:</strong> ${data.expiryDate}

</td></tr>

<tr><td align="center" style="padding:30px 0;">
<a href="https://kisschat.ai" style="
background: linear-gradient(95deg,#F60000,#C7290A,#C412DB);
padding:14px 40px;border-radius:14px;color:white;text-decoration:none;font-weight:700;">
Launch Kisschat 🚀
</a>
</td></tr>
`);
}
