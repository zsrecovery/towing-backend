// routes/user.ts
import express from "express";
import type { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../middleware/verifyJWT";
import { getMyProfile } from "../controllers/userController";
import { UserPayload } from "../types/index";

const router = express.Router();

// Get my profile (any authenticated user)
router.get(
  "/me",
  verifyJWT,
  (req: Request & { user?: UserPayload }, res: Response) => getMyProfile(req, res)
);

export default router;
