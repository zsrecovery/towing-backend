import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config(); // Load .env variables

// ✅ Check if JWT_SECRET is loaded
console.log("JWT_SECRET at runtime:", process.env.JWT_SECRET)
console.log("JWT_REFRESH_SECRET at runtime:", process.env.JWT_REFRESH_SECRET);

const PORT = process.env.PORT ? Number(process.env.PORT) : 10000;

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET is not set. Set it in .env or Render environment variables.");
}

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.error("❌ JWT secrets missing! Check .env file.");
  process.exit(1);
}
const app = express();

// --------------------
// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// --------------------
// Routes
import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";
import driversRoutes from "./routes/drivers";
import towRoutes from "./routes/tow";
import userRoutes from "./routes/user";

app.use("/api/auth", authRoutes);       // Auth: register, login
app.use("/api/admin", adminRoutes);     // Admin-only operations
app.use("/api/drivers", driversRoutes); // Drivers management
app.use("/api/tow", towRoutes);         // Tow booking and management
app.use("/api/user", userRoutes);       // User profile routes

// --------------------
// Health check
app.get("/", (_req: Request, res: Response) => {
  res.send("Towing backend is running 🚗");
});

// --------------------
// Catch-all 404
app.use((_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({ error: "Route not found" });
});

// --------------------
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
