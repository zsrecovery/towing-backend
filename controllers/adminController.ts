// controllers/adminController.ts
import express from "express";
import type { Request, Response, NextFunction } from "express";
import { pool } from "../db";

// Get all users (admin)
export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query("SELECT id, name, email, role FROM users");

    res.json({ users: result.rows });

  } catch (err) {
    console.error("ADMIN GET USERS ERROR:", err);
    next(err); // 🔥 send to global error handler
  }
};

// Delete a user (admin)
export const deleteUser = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING *", [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: "User not found" });
    res.json({ message: `User ${req.params.id} deleted successfully` });
  } catch (err: any) {
    console.error("ADMIN DELETE USER ERROR:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
