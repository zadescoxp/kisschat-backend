"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatController = chatController;
exports.newChatController = newChatController;
const chat_services_1 = require("../services/chat_models/chat.services");
async function chatController(req, res) {
    const { chat_id, prompt } = req.body;
    const characterDetails = await (0, chat_services_1.getCharacterResponse)(chat_id, prompt);
    res.json({ characterDetails });
}
async function newChatController(req, res) {
    const { character_id } = req.body;
    const user_id = req.user?.id;
    const newChat = await (0, chat_services_1.getNewChatID)(user_id || '', character_id);
    res.json({ newChatID: newChat.chat_id });
}
