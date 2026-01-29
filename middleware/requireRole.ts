// middleware/requireRole.ts
import express from "express";
import type { Response, NextFunction } from "express";
import type { UserPayload } from "../types/user";
import { AuthRequest } from "./verifyJWT";

export const requireRole = (...allowedRoles: UserPayload["role"][]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
};
