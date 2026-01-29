// routes/drivers.ts
import express from "express";
import { verifyJWT } from "../middleware/verifyJWT";
import { requireRole } from "../middleware/requireRole";
import { getAllDrivers, getDriverById, updateDriver } from "../controllers/driverController";
import type { UserPayload } from "../types/user";
import type { Request } from "express";

const router = express.Router();

// GET all drivers (Admin only)
router.get("/", verifyJWT, requireRole("admin"), getAllDrivers);

// GET single driver by ID (Admin or self)
router.get("/:id", verifyJWT, getDriverById);

// UPDATE driver info (Admin or self)
router.put("/:id", verifyJWT, updateDriver);

export default router;
