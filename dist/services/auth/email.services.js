"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpWithEmail = signUpWithEmail;
exports.loginWithEmail = loginWithEmail;
exports.logout = logout;
const supabase_config_1 = __importDefault(require("../../config/supabase.config"));
async function signUpWithEmail({ email, password }) {
    const { data, error } = await supabase_config_1.default.auth.signUp({
        email,
        password,
    });
    if (error) {
        throw new Error(error.message);
    }
    return data;
}
async function loginWithEmail({ email, password }) {
    const { data, error } = await supabase_config_1.default.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        throw new Error(error.message);
    }
    return data;
}
async function logout() {
    const { error } = await supabase_config_1.default.auth.signOut();
    if (error) {
        throw new Error(error.message);
    }
    return;
}
