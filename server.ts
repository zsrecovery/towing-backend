import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();

// --------------------
// Middleware
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());

// --------------------
// Routes
import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";
import driversRoutes from "./routes/drivers";
import towRoutes from "./routes/tow";
import userRoutes from "./routes/user";

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/drivers", driversRoutes);
app.use("/api/tow", towRoutes);
app.use("/api/user", userRoutes);

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

app.use(errorHandler);

export default app;