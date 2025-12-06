import { OpenRouter } from "@openrouter/sdk";

const client = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY || "",
})

const getModelResponse = async (prompt: string) => {
    const response = await client.chat.send({
        model: "",
        messages: [{
            "role": "user",
            "content": prompt
        }]
    })
}

export default getModelResponse;