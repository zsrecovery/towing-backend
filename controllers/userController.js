"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyProfile = void 0;
const db_1 = require("../db");
// Get logged-in user's profile
const getMyProfile = async (req, res) => {
    try {
        const result = await db_1.pool.query("SELECT id, name, email, role, phone FROM users WHERE id=$1", [req.user.id]);
        if (!result.rows[0])
            return res.status(404).json({ error: "User not found" });
        res.json({ user: result.rows[0] });
    }
    catch (err) {
        console.error("GET PROFILE ERROR:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};
exports.getMyProfile = getMyProfile;
