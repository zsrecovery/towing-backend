// controllers/driverController.ts
import express from "express";
import type { Request, Response } from "express";
import { pool } from "../db";
import { UserPayload } from "../types/user";

// Typed request with params and user
interface DriverParams {
  id: string;
}
// GET all drivers (admin only)
export const getAllDrivers = async (_req: Request & { user?: UserPayload }, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, vehicle FROM users WHERE role='driver'"
    );
    res.json({ drivers: result.rows });
  } catch (err: any) {
    console.error("FETCH DRIVERS ERROR:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// GET single driver (admin or self)
export const getDriverById = async (req: Request<{ id: string }> & { user?: UserPayload }, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT id, name, email, role, vehicle FROM users WHERE id=$1 AND role='driver'",
      [id]
    );
    const driver = result.rows[0];
    if (!driver) return res.status(404).json({ error: "Driver not found" });

    // Only admin or self can view
    if (req.user?.role !== "admin" && req.user?.id !== driver.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json({ driver });
  } catch (err: any) {
    console.error("FETCH DRIVER ERROR:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// UPDATE driver (admin or self)
export const updateDriver = async (
  req: Request<{ id: string }, {}, { name?: string; vehicle?: string }> & { user?: UserPayload },
  res: Response
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
  } catch (err: any) {
    console.error("UPDATE DRIVER ERROR:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
