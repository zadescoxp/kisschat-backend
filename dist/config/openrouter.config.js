"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@openrouter/sdk");
const model = new sdk_1.OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY || "",
});
const getResponse = async (messages) => {
    const response = await model.chat.send({
        model: "mistralai/mixtral-8x7b-instruct",
        messages: messages,
        maxTokens: 1024,
        temperature: 0.7,
    });
    return response;
};
exports.default = getResponse;
