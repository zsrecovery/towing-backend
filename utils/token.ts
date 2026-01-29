import jwt from "jsonwebtoken";
import { UserPayload } from "../types";

const ACCESS_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const generateAccessToken = (user: UserPayload) => {
  return jwt.sign(user, ACCESS_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (user: UserPayload) => {
  return jwt.sign(user, REFRESH_SECRET, { expiresIn: "7d" });
};
