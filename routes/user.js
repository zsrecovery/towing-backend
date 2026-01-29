"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/user.ts
const express_1 = __importDefault(require("express"));
const verifyJWT_1 = require("../middleware/verifyJWT");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
// Get my profile (any authenticated user)
router.get("/me", verifyJWT_1.verifyJWT, (req, res) => (0, userController_1.getMyProfile)(req, res));
exports.default = router;
