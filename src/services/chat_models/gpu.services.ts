import { configDotenv } from "dotenv";

configDotenv();

const MODEL_ENDPOINT = `http://${process.env.VASTAI_INSTANCE_IP}:${process.env.VASTAI_INSTANCE_PORT}/api/chat`;

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.VASTAI_OPEN_BUTTON_TOKEN}`
};

export async function generateResponse(messages: Array<{ role: string; content: any }>, max_tokens: number, temperature: number) {
    const payload = {
        model: "huihui_ai/qwen3-abliterated:8b",
        max_tokens: max_tokens || 1024,
        temperature: temperature || 0.7,
        stream: false,
        messages: messages
    }

    console.log('Sending request to model API with payload:', payload);
    console.log('Using headers:', headers);

    const res = await fetch(MODEL_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Model API error: ${res.status} - ${errorText}`);
    }
    const data = await res.json();
    console.log('Response received from model API:', data);
    return data;
}