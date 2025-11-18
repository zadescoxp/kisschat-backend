"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserController = createUserController;
const supabase_config_1 = __importDefault(require("../config/supabase.config"));
async function createUserController(req, res) {
    const { username, email, avatar_url, last_login } = req.body;
    if (!username || !email) {
        return res.status(400).json({ error: "Username and email are required" });
    }
    const { error } = await supabase_config_1.default.from('users').insert({
        username,
        email,
        avatar_url,
        status: "active",
        last_login
    });
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(201).json({ message: "User created successfully" });
}
