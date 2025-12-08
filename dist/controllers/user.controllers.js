"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserController = updateUserController;
exports.deleteUserController = deleteUserController;
const supabase_config_1 = __importDefault(require("../config/supabase.config"));
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
