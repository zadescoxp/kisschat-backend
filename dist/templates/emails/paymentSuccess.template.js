export function paymentSuccessTemplate(data) {
    return `
        <h2>🎉 Payment Successful!</h2>
        <p>Hi ${data.username},</p>
        <p>Thank you for your purchase! Your payment has been processed successfully.</p>
        <br>
        <p><strong>Transaction ID:</strong> ${data.trackId}</p>
        <p><strong>Amount Paid:</strong> $${data.amount}</p>
        <p><strong>Plan:</strong> ${data.plan.charAt(0).toUpperCase() + data.plan.slice(1)}</p>
        <p><strong>Duration:</strong> ${data.duration} month(s)</p>
        <p><strong>Kiss Coins Added:</strong> ${data.coinsAdded}</p>
        <p><strong>Expires On:</strong> ${data.expiryDate}</p>
        <br>
        <p>Enjoy your premium features!</p>
    `;
}
