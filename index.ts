// index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());

// Routes
import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";
import driversRoutes from "./routes/drivers";
import towRoutes from "./routes/tow";
import userRoutes from "./routes/user";





// --------------------
// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON body

// --------------------
// Routes
app.use("/api/auth", authRoutes);       // Auth: register, login
app.use("/api/admin", adminRoutes);     // Admin-only operations
app.use("/api/drivers", driversRoutes); // Drivers management
app.use("/api/tow", towRoutes);         // Tow booking and management
app.use("/api/user", userRoutes);       // User profile routes
app.use("/api/auth", userRoutes);

// --------------------
// Health check
app.get("/", (_req: Request, res: Response) => {
  res.send("Towing backend is running 🚗");
});

// --------------------
// Catch-all 404
app.use((_req: Request, res: Response, _next: any) => {
  res.status(404).json({ error: "Route not found" });
});

// --------------------
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
