import getResponse from "../config/openrouter.config.js";
export async function automateController(req, res) {
    try {
        const { messages } = req.body;
        if (!messages) {
            return res.status(400).json({ error: "Invalid input: 'messages' must be a string." });
        }
        const response = await getResponse(messages);
        res.json({ message: response.choices[0].message.content });
    }
    catch (error) {
        console.error("Error in automateController:", error);
        res.status(500).json({ error: "An error occurred while processing the request." });
    }
}
export async function enhanceImagePromptController(req, res) {
    try {
        const { prompt } = req.body;
        if (!prompt || typeof prompt !== "string") {
            return res.status(400).json({ error: "Invalid input: 'prompt' must be a string." });
        }
        const enhancedPrompt = `Enhance the following image generation prompt for better results and make sure to just give the prompt and nothing else: "${prompt}"`;
        const response = await getResponse(enhancedPrompt);
        res.json({ enhancedPrompt: response.choices[0].message.content });
    }
    catch (error) {
        console.error("Error in enhanceImagePromptController:", error);
        res.status(500).json({ error: "An error occurred while processing the request." });
    }
}
