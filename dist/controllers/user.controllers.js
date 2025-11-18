"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserController = createUserController;
exports.updateUserController = updateUserController;
exports.deleteUserController = deleteUserController;
const supabase_config_1 = __importDefault(require("../config/supabase.config"));
const check_util_1 = require("../utils/check.util");
async function createUserController(req, res) {
    const { username, email, avatar_url, last_login } = req.body;
    const existingUser = await (0, check_util_1.checkUser)(email);
    if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
    }
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
    res.status(201).json({ message: "Account created successfully !" });
}
async function updateUserController(req, res) {
    const { id } = req.params;
    const { username, avatar_url, status, last_login } = req.body;
    const { error } = await supabase_config_1.default.from('users').update({
        username,
        avatar_url,
        status,
        last_login
    }).eq('id', id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json({ message: "Account updated successfully !" });
}
async function deleteUserController(req, res) {
    const { id } = req.params;
    const { error } = await supabase_config_1.default.from('users').delete().eq('id', id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json({ message: "Account deleted successfully !" });
}
