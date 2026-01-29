"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getAllUsers = void 0;
const db_1 = require("../db");
// Get all users (admin)
const getAllUsers = async (_req, res) => {
    try {
        const result = await db_1.pool.query("SELECT id, name, email, role FROM users");
        res.json({ users: result.rows });
    }
    catch (err) {
        console.error("ADMIN GET USERS ERROR:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};
exports.getAllUsers = getAllUsers;
// Delete a user (admin)
const deleteUser = async (req, res) => {
    try {
        const result = await db_1.pool.query("DELETE FROM users WHERE id=$1 RETURNING *", [req.params.id]);
        if (!result.rows[0])
            return res.status(404).json({ error: "User not found" });
        res.json({ message: `User ${req.params.id} deleted successfully` });
    }
    catch (err) {
        console.error("ADMIN DELETE USER ERROR:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};
exports.deleteUser = deleteUser;
