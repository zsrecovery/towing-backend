// controllers/userController.ts
import express from "express";
import type { Request, Response } from "express";
import { pool } from "../db";
import { UserPayload } from "../types/user";

// Get logged-in user's profile
export const getMyProfile = async (req: Request & { user?: UserPayload }, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, phone FROM users WHERE id=$1",
      [req.user!.id]
    );

    if (!result.rows[0]) return res.status(404).json({ error: "User not found" });

    res.json({ user: result.rows[0] });
  } catch (err: any) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
