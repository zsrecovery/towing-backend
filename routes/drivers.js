"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/drivers.ts
const express_1 = __importDefault(require("express"));
const verifyJWT_1 = require("../middleware/verifyJWT");
const requireRole_1 = require("../middleware/requireRole");
const driverController_1 = require("../controllers/driverController");
const router = express_1.default.Router();
// GET all drivers (Admin only)
router.get("/", verifyJWT_1.verifyJWT, (0, requireRole_1.requireRole)("admin"), driverController_1.getAllDrivers);
// GET single driver by ID (Admin or self)
router.get("/:id", verifyJWT_1.verifyJWT, driverController_1.getDriverById);
// UPDATE driver info (Admin or self)
router.put("/:id", verifyJWT_1.verifyJWT, driverController_1.updateDriver);
exports.default = router;
