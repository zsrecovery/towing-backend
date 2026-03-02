import rateLimit from "express-rate-limit";

// Limit login attempts
export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // 5 attempts per minute per IP
  message: {
    error: "TooManyRequests",
    message: "Too many login attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});