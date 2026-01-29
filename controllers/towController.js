"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignDriver = exports.updateBookingStatus = exports.getAllBookings = exports.getMyBookings = exports.bookTow = void 0;
const db_1 = require("../db");
// Book a tow (USER)
const bookTow = async (req, res) => {
    const { pickup, dropoff, vehicle, service } = req.body;
    const userId = req.user.id;
    try {
        const result = await db_1.pool.query(`INSERT INTO bookings 
      (user_id, pickup_location, dropoff_location, vehicle, service, status)
      VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`, [req.user.id, pickup || null, dropoff || null, vehicle || null, service]);
        res.status(201).json({ message: "Tow booked successfully", booking: result.rows[0] });
    }
    catch (err) {
        console.error("BOOK ERROR:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};
exports.bookTow = bookTow;
// Get my bookings (USER)
const getMyBookings = async (req, res) => {
    try {
        const result = await db_1.pool.query(`SELECT b.id, b.user_id AS "clientId", b.service, b.status,
              b.created_at AS "bookingDate", b.pickup_location AS pickup, b.dropoff_location AS dropoff, b.vehicle
       FROM bookings b
       JOIN users u ON u.id = b.user_id
       WHERE b.user_id=$1
       ORDER BY b.created_at DESC`, [req.user.id]);
        res.json({ bookings: result.rows });
    }
    catch (err) {
        console.error("MY BOOKINGS ERROR:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};
exports.getMyBookings = getMyBookings;
// Admin: get all bookings
const getAllBookings = async (_req, res) => {
    try {
        const result = await db_1.pool.query(`SELECT b.id, b.user_id AS "clientId", u.name, b.service, b.status,
              b.created_at AS "bookingDate", b.pickup_location AS pickup, b.dropoff_location AS dropoff,
              b.vehicle, b.driver_id
       FROM bookings b
       JOIN users u ON u.id = b.user_id
       ORDER BY b.created_at DESC`);
        res.json({ bookings: result.rows });
    }
    catch (err) {
        console.error("ALL BOOKINGS ERROR:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};
exports.getAllBookings = getAllBookings;
// Admin: update booking status
const updateBookingStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const result = await db_1.pool.query("UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *", [status, req.params.id]);
        if (!result.rows[0])
            return res.status(404).json({ error: "Booking not found" });
        res.json({ message: "Status updated", booking: result.rows[0] });
    }
    catch (err) {
        console.error("UPDATE STATUS ERROR:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};
exports.updateBookingStatus = updateBookingStatus;
// Admin: assign driver
const assignDriver = async (req, res) => {
    const { driver_id } = req.body;
    try {
        const result = await db_1.pool.query("UPDATE bookings SET driver_id=$1 WHERE id=$2 RETURNING *", [driver_id, req.params.id]);
        if (!result.rows[0])
            return res.status(404).json({ error: "Booking not found" });
        res.json({ message: "Driver assigned", booking: result.rows[0] });
    }
    catch (err) {
        console.error("ASSIGN DRIVER ERROR:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
};
exports.assignDriver = assignDriver;
