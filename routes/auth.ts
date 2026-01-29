// routes/auth.ts
import express, { Request, Response } from "express";
import { registerUser, loginUser, ping, refreshAccessToken, logoutUser, me } from "../controllers/authController";
import { verifyJWT } from "../middleware/verifyJWT";

const router = express.Router();

// Ping route
router.get("/ping", (_req: Request, res: Response) => ping(_req, res));

// Register
router.post("/register", (req: Request, res: Response) => registerUser(req, res));

// Login
router.post("/login", (req: Request, res: Response) => loginUser(req, res));

// Refresh token
router.post("/refresh", (req: Request, res: Response) => refreshAccessToken(req, res));

// Logout
router.post("/logout", (req: Request, res: Response) => logoutUser(req, res));

// Me
router.get("/me", verifyJWT, me);

export default router;
