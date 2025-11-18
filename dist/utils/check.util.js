"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUser = checkUser;
const supabase_config_1 = __importDefault(require("../config/supabase.config"));
async function checkUser(email) {
    const { data, error } = await supabase_config_1.default
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
    if (error) {
        return false;
        // throw new Error(error.message);
    }
    return data;
}
