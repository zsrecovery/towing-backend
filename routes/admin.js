"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/admin.ts
const express_1 = __importDefault(require("express"));
const verifyJWT_1 = require("../middleware/verifyJWT");
const requireRole_1 = require("../middleware/requireRole");
const adminController_1 = require("../controllers/adminController");
const router = express_1.default.Router();
// TEST: Admin route
router.get("/ping", verifyJWT_1.verifyJWT, (0, requireRole_1.requireRole)("admin"), (_req, res) => {
    res.json({ message: "Admin route working ✅" });
});
// ADMIN: Get all users
router.get("/users", verifyJWT_1.verifyJWT, (0, requireRole_1.requireRole)("admin"), (req, res) => {
    return (0, adminController_1.getAllUsers)(req, res);
});
// ADMIN: Delete user
router.delete("/users/:id", verifyJWT_1.verifyJWT, (0, requireRole_1.requireRole)("admin"), (req, res) => {
    (0, adminController_1.deleteUser)(req, res);
});
exports.default = router;
