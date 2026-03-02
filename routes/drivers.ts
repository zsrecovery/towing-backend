import express, { Request, Response } from "express";
import { verifyJWT } from "../middleware/verifyJWT";
import { requireRole } from "../middleware/requireRole";
import { getAllDrivers, getDriverById, updateDriver, registerDriver } from "../controllers/driverController";
import { driverRegisterValidation, driverUpdateValidation } from "../validators/driverValidator";
import { handleValidationErrors } from "../middleware/handleValidationErrors";

const router = express.Router();

// --------------------
// ADMIN: GET all drivers
router.get("/", verifyJWT, requireRole("admin"), getAllDrivers);

// --------------------
// GET single driver by ID (Admin or self)
router.get("/:id", verifyJWT, getDriverById);

// --------------------
// REGISTER driver (optional if you have a route for driver signup)
router.post(
  "/register",
  driverRegisterValidation,
  handleValidationErrors,
    registerDriver
);

// --------------------
// UPDATE driver info (Admin or self)
router.put(
  "/:id",
  verifyJWT,
  driverUpdateValidation,
  handleValidationErrors,
    updateDriver
);

export default router;
