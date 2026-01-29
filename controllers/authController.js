"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.refreshAccessToken = exports.loginUser = exports.registerUser = exports.me = exports.ping = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const token_1 = require("../utils/token");
/* =========================
   Ping
========================= */
const ping = (_req, res) => {
    res.json({ message: "Auth route working ✅" });
};
exports.ping = ping;
const me = (req, res) => {
    return res.status(200).json({
        status: "success",
        data: req.user
    });
};
exports.me = me;
/* =========================
   Register
========================= */
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            error: "Bad Request",
            message: "Name, email, and password are required",
        });
    }
    try {
        const existingUser = await db_1.pool.query("SELECT id FROM users WHERE email=$1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                error: "Bad Request",
                message: "User already exists",
            });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Prevent privilege escalation
        const assignedRole = role === "driver" ? "driver" : "user";
        const result = await db_1.pool.query(`INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`, [name, email, hashedPassword, assignedRole]);
        res.status(201).json({
            message: "User registered successfully",
            user: result.rows[0],
        });
    }
    catch (err) {
        console.error("REGISTER ERROR:", err.message);
        res.status(500).json({
            error: "Server Error",
            message: "Failed to register user",
        });
    }
};
exports.registerUser = registerUser;
/* =========================
   Login (ACCESS + REFRESH)
========================= */
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            error: "Bad Request",
            message: "Email and password are required",
        });
    }
    try {
        const userResult = await db_1.pool.query("SELECT * FROM users WHERE email=$1", [email]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "Invalid credentials",
            });
        }
        const user = userResult.rows[0];
        const validPassword = await bcrypt_1.default.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "Invalid credentials",
            });
        }
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        const accessToken = (0, token_1.generateAccessToken)(payload);
        // ✅ Use the correct refresh secret
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, {
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
    }
    catch (err) {
        console.error("LOGIN ERROR:", err.message);
        res.status(500).json({
            error: "Server Error",
            message: "Login failed",
        });
    }
};
exports.loginUser = loginUser;
/* =========================
   Refresh Access Token
========================= */
const refreshAccessToken = (req, res) => {
    const token = req.cookies?.refreshToken;
    if (!token) {
        return res.status(401).json({
            error: "Unauthorized",
            message: "Refresh token missing",
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
        const accessToken = (0, token_1.generateAccessToken)({
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
        });
        res.json({ accessToken });
    }
    catch (err) {
        console.error("Refresh token error:", err.message);
        res.status(401).json({
            error: "Unauthorized",
            message: "Invalid or expired refresh token",
        });
    }
};
exports.refreshAccessToken = refreshAccessToken;
/* =========================
   Logout
========================= */
const logoutUser = (_req, res) => {
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
};
exports.logoutUser = logoutUser;
