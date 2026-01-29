// middleware/verifyJWT.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserPayload } from "../types";

export interface AuthRequest <
P = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: UserPayload;
}

export const verifyJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // type guard
    if (typeof decoded === "object" && decoded !== null) {
      req.user = decoded as UserPayload;
      return next();
    }

    return res.status(401).json({ message: "Invalid token" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
