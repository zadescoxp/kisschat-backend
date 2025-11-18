import { Request, Response } from "express";
import supabase from "../config/supabase.config";
import { checkUser } from "../utils/check.util";

export async function createUserController(req: Request, res: Response) {
    const { username, email, avatar_url, last_login } = req.body;

    const existingUser = await checkUser(email);

    if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
    }

    if (!username || !email) {
        return res.status(400).json({ error: "Username and email are required" });
    }
    const { error } = await supabase.from('users').insert({
        username,
        email,
        avatar_url,
        status: "active",
        last_login
    })
    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: "Account created successfully !" });
}

export async function updateUserController(req: Request, res: Response) {
    const { id } = req.params;
    const { username, avatar_url, status, last_login } = req.body;

    const { error } = await supabase.from('users').update({
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

export async function deleteUserController(req: Request, res: Response) {
    const { id } = req.params;

    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json({ message: "Account deleted successfully !" });
}