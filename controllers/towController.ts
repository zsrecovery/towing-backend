// controllers/towController.ts
import express from "express";
import type { Request, Response } from "express";
import { pool } from "../db";
import { UserPayload } from "../types";
import { AuthRequest } from "../middleware/verifyJWT";

// Book a tow (USER)
export const bookTow = async (
  req: AuthRequest & Request<{}, {}, { pickup?: string; dropoff?: string; vehicle?: string; service: string }>,
  res: Response
) => {
  const { pickup, dropoff, vehicle, service } = req.body;
const userId = req.user!.id;

  try {
    const result = await pool.query(
      `INSERT INTO bookings 
      (user_id, pickup_location, dropoff_location, vehicle, service, status)
      VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
      [req.user!.id, pickup || null, dropoff || null, vehicle || null, service]
    );

    res.status(201).json({ message: "Tow booked successfully", booking: result.rows[0] });
  } catch (err: any) {
    console.error("BOOK ERROR:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// Get my bookings (USER)
export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT b.id, b.user_id AS "clientId", b.service, b.status,
              b.created_at AS "bookingDate", b.pickup_location AS pickup, b.dropoff_location AS dropoff, b.vehicle
       FROM bookings b
       JOIN users u ON u.id = b.user_id
       WHERE b.user_id=$1
       ORDER BY b.created_at DESC`,
      [req.user!.id]
    );

    res.json({ bookings: result.rows });
  } catch (err: any) {
    console.error("MY BOOKINGS ERROR:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// Admin: get all bookings
export const getAllBookings = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT b.id, b.user_id AS "clientId", u.name, b.service, b.status,
              b.created_at AS "bookingDate", b.pickup_location AS pickup, b.dropoff_location AS dropoff,
              b.vehicle, b.driver_id
       FROM bookings b
       JOIN users u ON u.id = b.user_id
       ORDER BY b.created_at DESC`
    );
    res.json({ bookings: result.rows });
  } catch (err: any) {
    console.error("ALL BOOKINGS ERROR:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// Admin: update booking status
export const updateBookingStatus = async (
  req: Request<{ id: string }, {}, { status: "pending" | "accepted" | "completed" }>,
  res: Response
) => {
  const { status } = req.body;

  try {
    const result = await pool.query(
      "UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *",
      [status, req.params.id]
    );

    if (!result.rows[0]) return res.status(404).json({ error: "Booking not found" });

    res.json({ message: "Status updated", booking: result.rows[0] });
  } catch (err: any) {
    console.error("UPDATE STATUS ERROR:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// Admin: assign driver
export const assignDriver = async (
  req: Request<{ id: string }, {}, { driver_id: number }>,
  res: Response
) => {
  const { driver_id } = req.body;

  try {
    const result = await pool.query(
      "UPDATE bookings SET driver_id=$1 WHERE id=$2 RETURNING *",
      [driver_id, req.params.id]
    );

    if (!result.rows[0]) return res.status(404).json({ error: "Booking not found" });

    res.json({ message: "Driver assigned", booking: result.rows[0] });
  } catch (err: any) {
    console.error("ASSIGN DRIVER ERROR:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
