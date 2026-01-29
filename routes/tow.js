"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/tow.ts
const express_1 = __importDefault(require("express"));
const verifyJWT_1 = require("../middleware/verifyJWT");
const requireRole_1 = require("../middleware/requireRole");
const towController_1 = require("../controllers/towController");
const router = express_1.default.Router();
// USER: Book a tow
router.post("/book", verifyJWT_1.verifyJWT, (req, res) => (0, towController_1.bookTow)(req, res));
// USER: View my bookings
router.get("/my", verifyJWT_1.verifyJWT, (req, res) => (0, towController_1.getMyBookings)(req, res));
// ADMIN: View all bookings
router.get("/all", verifyJWT_1.verifyJWT, (0, requireRole_1.requireRole)("admin"), towController_1.getAllBookings);
// ADMIN: Update booking status
router.patch("/status/:id", verifyJWT_1.verifyJWT, (0, requireRole_1.requireRole)("admin"), (req, res) => (0, towController_1.updateBookingStatus)(req, res));
// ADMIN: Assign driver
router.patch("/assign-driver/:id", verifyJWT_1.verifyJWT, (0, requireRole_1.requireRole)("admin"), (req, res) => (0, towController_1.assignDriver)(req, res));
exports.default = router;
