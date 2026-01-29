"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/auth.ts
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const verifyJWT_1 = require("../middleware/verifyJWT");
const router = express_1.default.Router();
// Ping route
router.get("/ping", (_req, res) => (0, authController_1.ping)(_req, res));
// Register
router.post("/register", (req, res) => (0, authController_1.registerUser)(req, res));
// Login
router.post("/login", (req, res) => (0, authController_1.loginUser)(req, res));
// Refresh token
router.post("/refresh", (req, res) => (0, authController_1.refreshAccessToken)(req, res));
// Logout
router.post("/logout", (req, res) => (0, authController_1.logoutUser)(req, res));
// Me
router.get("/me", verifyJWT_1.verifyJWT, authController_1.me);
exports.default = router;
