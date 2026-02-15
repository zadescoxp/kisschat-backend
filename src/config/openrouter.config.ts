import { OpenRouter } from "@openrouter/sdk";

const model = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY || "",
})

const getResponse = async (messages: any[]) => {
    const response = await model.chat.send({
        model: "openai/gpt-5-nano",
        messages: messages,
        maxTokens: 1024,
        temperature: 0.7,
    });

    return response;
}

export default getResponse;