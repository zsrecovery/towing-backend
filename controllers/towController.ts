import type { Request, Response, NextFunction } from "express";
import { pool } from "../db";
import { AuthRequest } from "../middleware/verifyJWT";

/* =========================
   USER: Book a Tow
========================= */
export const bookTow = async (
  req: AuthRequest & Request<{}, {}, { pickup?: string; dropoff?: string; vehicle?: string; service?: string }>,
  res: Response,
  next: NextFunction
) => {
  const { pickup, dropoff, vehicle, service } = req.body;
  const userId = req.user!.id;

  if (!service || typeof service !== "string") {
    return res.status(400).json({ status: "error", message: "Service is required" });
  }

  if (!pickup || !dropoff || !vehicle) {
    return res.status(400).json({ status: "error", message: "Pickup, dropoff and vehicle are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO bookings 
       (user_id, pickup_location, dropoff_location, vehicle, service, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING *`,
      [userId, pickup, dropoff, vehicle, service]
    );

    return res.status(201).json({
      status: "success",
      message: "Tow booked successfully",
      booking: result.rows[0]
    });
  } catch (err) {
    console.error("BOOK ERROR:", err);
    next(err); // send to global error handler
  }
};

/* =========================
   USER: Get My Bookings
========================= */
export const getMyBookings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query(
      `SELECT b.id,
              b.user_id AS "clientId",
              b.service,
              b.status,
              b.created_at AS "bookingDate",
              b.pickup_location AS pickup,
              b.dropoff_location AS dropoff,
              b.vehicle
       FROM bookings b
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [req.user!.id]
    );

    return res.json({ status: "success", bookings: result.rows });
  } catch (err) {
    console.error("MY BOOKINGS ERROR:", err);
    next(err);
  }
};

/* =========================
   ADMIN: Get All Bookings
========================= */
export const getAllBookings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ status: "error", message: "Forbidden" });
  }

  try {
    const result = await pool.query(
      `SELECT b.id,
              b.user_id AS "clientId",
              u.name,
              b.service,
              b.status,
              b.created_at AS "bookingDate",
              b.pickup_location AS pickup,
              b.dropoff_location AS dropoff,
              b.vehicle,
              b.driver_id
       FROM bookings b
       JOIN users u ON u.id = b.user_id
       ORDER BY b.created_at DESC`
    );

    return res.json({ status: "success", bookings: result.rows });
  } catch (err) {
    console.error("ALL BOOKINGS ERROR:", err);
    next(err);
  }
};

/* =========================
   ADMIN: Update Booking Status
========================= */
export const updateBookingStatus = async (
  req: AuthRequest & Request<{ id: string }, {}, { status?: "pending" | "accepted" | "completed" }>,
  res: Response,
  next: NextFunction
) => {
  const { status } = req.body;
  const bookingId = req.params.id;
  const allowedStatuses = ["pending", "accepted", "completed"];

  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({ status: "error", message: "Invalid status value" });
  }

  try {
    const result = await pool.query("UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *", [status, bookingId]);
    if (!result.rows[0]) return res.status(404).json({ status: "error", message: "Booking not found" });

    return res.json({ status: "success", message: "Status updated", booking: result.rows[0] });
  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    next(err);
  }
};

/* =========================
   ADMIN: Assign Driver
========================= */
export const assignDriver = async (
  req: AuthRequest & Request<{ id: string }, {}, { driver_id?: number }>,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ status: "error", message: "Forbidden" });
  }

  const { driver_id } = req.body;
  const bookingId = req.params.id;

  if (!driver_id || typeof driver_id !== "number") {
    return res.status(400).json({ status: "error", message: "Valid driver_id is required" });
  }

  try {
    const result = await pool.query("UPDATE bookings SET driver_id=$1 WHERE id=$2 RETURNING *", [driver_id, bookingId]);
    if (!result.rows[0]) return res.status(404).json({ status: "error", message: "Booking not found" });

    return res.json({ status: "success", message: "Driver assigned successfully", booking: result.rows[0] });
  } catch (err) {
    console.error("ASSIGN DRIVER ERROR:", err);
    next(err);
  }
};