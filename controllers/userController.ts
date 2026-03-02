// controllers/userController.ts
import type { Response } from "express";
import { pool } from "../db";
import { AuthRequest } from "../middleware/verifyJWT";

// --------------------
// Get logged-in user's profile
// --------------------
export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, phone FROM users WHERE id=$1",
      [req.user!.id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        error: "Not Found",
        message: "User not found"
      });
    }

    res.json({
      status: "success",
      user: result.rows[0]
    });
  } catch (err: any) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to retrieve user profile",
      details: err.message
    });
  }
};