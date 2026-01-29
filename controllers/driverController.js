"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDriver = exports.getDriverById = exports.getAllDrivers = void 0;
const db_1 = require("../db");
// GET all drivers (admin only)
const getAllDrivers = async (_req, res) => {
    try {
        const result = await db_1.pool.query("SELECT id, name, email, role, vehicle FROM users WHERE role='driver'");
        res.json({ drivers: result.rows });
    }
    catch (err) {
        console.error("FETCH DRIVERS ERROR:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};
exports.getAllDrivers = getAllDrivers;
// GET single driver (admin or self)
const getDriverById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db_1.pool.query("SELECT id, name, email, role, vehicle FROM users WHERE id=$1 AND role='driver'", [id]);
        const driver = result.rows[0];
        if (!driver)
            return res.status(404).json({ error: "Driver not found" });
        // Only admin or self can view
        if (req.user?.role !== "admin" && req.user?.id !== driver.id) {
            return res.status(403).json({ error: "Forbidden" });
        }
        res.json({ driver });
    }
    catch (err) {
        console.error("FETCH DRIVER ERROR:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};
exports.getDriverById = getDriverById;
// UPDATE driver (admin or self)
const updateDriver = async (req, res) => {
    const { id } = req.params;
    const { name, vehicle } = req.body;
    try {
        if (req.user?.role !== "admin" && req.user?.id !== parseInt(id)) {
            return res.status(403).json({ error: "Forbidden" });
        }
        const result = await db_1.pool.query("UPDATE users SET name=$1, vehicle=$2 WHERE id=$3 AND role='driver' RETURNING id, name, email, role, vehicle", [name, vehicle, id]);
        if (!result.rows[0])
            return res.status(404).json({ error: "Driver not found" });
        res.json({ message: "Driver updated", driver: result.rows[0] });
    }
    catch (err) {
        console.error("UPDATE DRIVER ERROR:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};
exports.updateDriver = updateDriver;
