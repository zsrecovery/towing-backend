import type { Request, Response, NextFunction } from "express";
import { pool } from "../db";
import bcrypt from "bcrypt";
import { UserPayload } from "../types/user";

// Typed request with params and user
interface DriverParams {
  id: string;
}

// REGISTER DRIVER (Admin only)
export const registerDriver = async (
  req: Request<{}, {}, { name: string; email: string; password: string; vehicle?: string }> & { user?: UserPayload },
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, vehicle } = req.body;

  try {
    // Only admin can register drivers
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Check if driver already exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Driver already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, vehicle)
       VALUES ($1, $2, $3, 'driver', $4)
       RETURNING id, name, email, role, vehicle`,
      [name, email, hashedPassword, vehicle || null]
    );

    res.status(201).json({ message: "Driver registered", driver: result.rows[0] });
  } catch (err) {
    console.error("REGISTER DRIVER ERROR:", err);
    next(err); // send to global error handler
  }
};

// GET all drivers (admin only)
export const getAllDrivers = async (
  _req: Request & { user?: UserPayload },
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, vehicle FROM users WHERE role='driver'"
    );
    res.json({ drivers: result.rows });
  } catch (err) {
    console.error("FETCH DRIVERS ERROR:", err);
    next(err); // send to global error handler
  }
};

// GET single driver (admin or self)
export const getDriverById = async (
  req: Request<{ id: string }> & { user?: UserPayload },
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT id, name, email, role, vehicle FROM users WHERE id=$1 AND role='driver'",
      [id]
    );

    const driver = result.rows[0];
    if (!driver) return res.status(404).json({ error: "Driver not found" });

    res.json({ driver });
  } catch (err) {
    console.error("FETCH DRIVER ERROR:", err);
    next(err);
  }
};

// UPDATE driver (admin or self)
export const updateDriver = async (
  req: Request<{ id: string }, {}, { name?: string; vehicle?: string }> & { user?: UserPayload },
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, vehicle } = req.body;

  try {
    if (req.user?.role !== "admin" && req.user?.id !== parseInt(id)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const result = await pool.query(
      "UPDATE users SET name=$1, vehicle=$2 WHERE id=$3 AND role='driver' RETURNING id, name, email, role, vehicle",
      [name, vehicle, id]
    );

    if (!result.rows[0]) return res.status(404).json({ error: "Driver not found" });

    res.json({ message: "Driver updated", driver: result.rows[0] });
  } catch (err) {
    console.error("UPDATE DRIVER ERROR:", err);
    next(err);
  }
};