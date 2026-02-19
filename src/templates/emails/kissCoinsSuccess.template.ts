interface KissCoinsSuccessTemplateData {
    username: string;
    trackId: string;
    amount: string;
    kissCoins: number;
}

export function kissCoinsSuccessTemplate(data: KissCoinsSuccessTemplateData): string {
    return `
        <h2>💰 Kiss Coins Added!</h2>
        <p>Hi ${data.username},</p>
        <p>Your Kiss Coins purchase has been completed successfully!</p>
        <br>
        <p><strong>Transaction ID:</strong> ${data.trackId}</p>
        <p><strong>Amount Paid:</strong> $${data.amount}</p>
        <p><strong>Kiss Coins Added:</strong> ${data.kissCoins}</p>
        <br>
        <p>Happy chatting!</p>
    `;
}
