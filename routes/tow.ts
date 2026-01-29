// routes/tow.ts
import express from "express";
import { Response } from "express";
import { verifyJWT, AuthRequest } from "../middleware/verifyJWT";
import { requireRole } from "../middleware/requireRole";
import { bookTow, getMyBookings, getAllBookings, updateBookingStatus, assignDriver } from "../controllers/towController";

const router = express.Router();

// USER: Book a tow
router.post("/book", verifyJWT, (req: AuthRequest, res: Response) => bookTow(req, res));

// USER: View my bookings
router.get("/my", verifyJWT, (req: AuthRequest, res: Response) => getMyBookings(req, res));

// ADMIN: View all bookings
router.get("/all", verifyJWT, requireRole("admin"), getAllBookings);

// ADMIN: Update booking status
router.patch("/status/:id", verifyJWT, requireRole("admin"), (req: AuthRequest<{ id: string }, {}, { status: "pending" | "accepted" | "completed" }>,
    res: Response
  ) => updateBookingStatus(req, res));

// ADMIN: Assign driver
router.patch("/assign-driver/:id", verifyJWT, requireRole("admin"), (req: AuthRequest<{ id: string }, {}, { driver_id: number }>,
    res: Response
  ) => assignDriver(req, res));

export default router;
