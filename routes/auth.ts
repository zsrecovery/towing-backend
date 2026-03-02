// routes/auth.ts
import express, { Request, Response } from "express";
import { registerUser, loginUser, ping, refreshAccessToken, logoutUser, me } from "../controllers/authController";
import { verifyJWT } from "../middleware/verifyJWT";
import { registerValidation, loginValidation } from "../validators/authValidator";
import { handleValidationErrors } from "../middleware/handleValidationErrors";
import { loginLimiter } from "../middleware/rateLimiter";

const router = express.Router();

// Ping route
router.get("/ping", (_req: Request, res: Response) => ping(_req, res));

// Register
// Register route
router.post(
  "/register",
  registerValidation,
  handleValidationErrors,
  registerUser
);

// Login
router.post(
  "/login",
  loginLimiter,
  loginValidation,
  handleValidationErrors,
  loginUser
);

// Refresh token
router.post("/refresh", refreshAccessToken);

// Logout
router.post("/logout", logoutUser);

// Me
router.get("/me", verifyJWT, me);

export default router;
