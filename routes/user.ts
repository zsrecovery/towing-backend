// routes/user.ts
import express, { Request, Response } from "express";
import { verifyJWT } from "../middleware/verifyJWT";
import { getMyProfile } from "../controllers/userController";
import { UserPayload } from "../types";

const router = express.Router();

// --------------------
// Public test route
router.get("/", (_req: Request, res: Response) => {
  res.json({ message: "User root route works!" });
});

// --------------------
// Authenticated route: Get my profile
router.get(
  "/me",
  verifyJWT,
  (req: Request & { user?: UserPayload }, res: Response) => getMyProfile(req, res)
);

export default router;
