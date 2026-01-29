// controllers/authController.ts
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db";
import type { UserPayload } from "../types";
import { generateAccessToken } from "../utils/token";
import { AuthRequest } from "../middleware/verifyJWT";

/* =========================
   Types
========================= */

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin" | "driver";
}

interface LoginBody {
  email: string;
  password: string;
}

/* =========================
   Ping
========================= */

export const ping = (_req: Request, res: Response) => {
  res.json({ message: "Auth route working ✅" });
};

export const me = (req: AuthRequest, res: Response) => {
  return res.status(200).json({
    status: "success",
    data: req.user
  });
};

/* =========================
   Register
========================= */

export const registerUser = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Name, email, and password are required",
    });
  }

  try {
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Prevent privilege escalation
    const assignedRole: "user" | "admin" | "driver" =
      role === "driver" ? "driver" : "user";

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name, email, hashedPassword, assignedRole]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (err: any) {
    console.error("REGISTER ERROR:", err.message);
    res.status(500).json({
      error: "Server Error",
      message: "Failed to register user",
    });
  }
};

/* =========================
   Login (ACCESS + REFRESH)
========================= */

export const loginUser = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Email and password are required",
    });
  }

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid credentials",
      });
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid credentials",
      });
    }

    const payload: UserPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);

    // ✅ Use the correct refresh secret
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: "7d",
    });

    // 🔐 Store refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // false locally
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user: payload,
    });
  } catch (err: any) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({
      error: "Server Error",
      message: "Login failed",
    });
  }
};

/* =========================
   Refresh Access Token
========================= */

export const refreshAccessToken = (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Refresh token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as UserPayload;

    const accessToken = generateAccessToken({
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    });

    res.json({ accessToken });
  } catch (err: any) {
    console.error("Refresh token error:", err.message);
    res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or expired refresh token",
    });
  }
};

/* =========================
   Logout
========================= */

export const logoutUser = (_req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};
