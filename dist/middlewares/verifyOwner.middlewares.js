"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOwnerMiddleware = verifyOwnerMiddleware;
const supabase_config_1 = __importDefault(require("../config/supabase.config"));
async function verifyOwnerMiddleware(req, res, next) {
    try {
        const characterId = req.params.id;
        if (!characterId) {
            return res.status(400).json({ error: 'Character ID is required' });
        }
        // Fetch the character from the database
        const { data: character, error } = await supabase_config_1.default
            .from('characters')
            .select('character_user_id')
            .eq('id', characterId)
            .single();
        if (error || !character) {
            return res.status(404).json({ error: 'Character not found' });
        }
        // Check if the authenticated user is the owner of the character
        if (character.character_user_id !== req.user?.id) {
            return res.status(403).json({ error: 'You do not have permission to access this resource' });
        }
        next();
    }
    catch (err) {
        console.error('Error in verifyOwnerMiddleware:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
