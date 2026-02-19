interface PaymentFailedTemplateData {
    username: string;
    trackId: string;
    amount: string;
    description: string;
}

export function paymentFailedTemplate(data: PaymentFailedTemplateData): string {
    return `
        <h2>Payment Failed</h2>
        <p>Hi ${data.username},</p>
        <p>Unfortunately, your payment has failed.</p>
        <br>
        <p><strong>Transaction ID:</strong> ${data.trackId}</p>
        <p><strong>Amount:</strong> $${data.amount}</p>
        <p><strong>Plan:</strong> ${data.description}</p>
        <br>
        <p>Please try again or contact support if the issue persists.</p>
    `;
}
