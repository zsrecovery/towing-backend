import express, { Request, Response } from "express";
import { verifyJWT, AuthRequest } from "../middleware/verifyJWT";
import { requireRole } from "../middleware/requireRole";
import { bookTow, getMyBookings, getAllBookings, updateBookingStatus, assignDriver } from "../controllers/towController";
import { bookTowValidation } from "../validators/bookingValidator";
import { handleValidationErrors } from "../middleware/handleValidationErrors";

const router = express.Router();

// --------------------
// USER: Book a tow
interface BookTowBody {
  service: string;
  pickupLocation?: string;
  destination?: string;
}

router.post(
  "/book",
  verifyJWT,
  bookTowValidation,
  handleValidationErrors,
  bookTow
);

// USER: View my bookings
router.get("/my", verifyJWT, getMyBookings);

// ADMIN: View all bookings
router.get("/all", verifyJWT, requireRole("admin"), getAllBookings);

// ADMIN: Update booking status
router.patch(
  "/status/:id",
  verifyJWT,
  requireRole("admin"),
  updateBookingStatus,
  handleValidationErrors,
);

// ADMIN: Assign driver
router.patch(
  "/assign-driver/:id",
  verifyJWT,
  requireRole("admin"),
 assignDriver
);

export default router;
