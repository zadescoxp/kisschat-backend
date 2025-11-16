"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInWithDiscord = signInWithDiscord;
const supabase_config_1 = __importDefault(require("../../config/supabase.config"));
async function signInWithDiscord() {
    const { data, error } = await supabase_config_1.default.auth.signInWithOAuth({
        provider: 'discord',
        options: {
            redirectTo: 'http://localhost:30000'
        }
    });
    if (error) {
        throw new Error(error.message);
    }
    return data;
}
