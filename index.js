"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config(); // Load .env variables
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cookie_parser_1.default)());
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const admin_1 = __importDefault(require("./routes/admin"));
const drivers_1 = __importDefault(require("./routes/drivers"));
const tow_1 = __importDefault(require("./routes/tow"));
const user_1 = __importDefault(require("./routes/user"));
// --------------------
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // Parse JSON body
// --------------------
// Routes
app.use("/api/auth", auth_1.default); // Auth: register, login
app.use("/api/admin", admin_1.default); // Admin-only operations
app.use("/api/drivers", drivers_1.default); // Drivers management
app.use("/api/tow", tow_1.default); // Tow booking and management
app.use("/api/user", user_1.default); // User profile routes
app.use("/api/auth", user_1.default);
// --------------------
// Health check
app.get("/", (_req, res) => {
    res.send("Towing backend is running 🚗");
});
// --------------------
// Catch-all 404
app.use((_req, res, _next) => {
    res.status(404).json({ error: "Route not found" });
});
// --------------------
// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
