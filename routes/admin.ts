// routes/admin.ts
import express from "express";
import type { Request, Response } from "express";
import { verifyJWT } from "../middleware/verifyJWT";
import { requireRole } from "../middleware/requireRole";
import { getAllUsers, deleteUser } from "../controllers/adminController";
import type { UserPayload } from "../types/user";
import type { AuthenticatedRequest } from "../types/custom.d";
import { param } from "express-validator";
import { handleValidationErrors } from "../middleware/handleValidationErrors";

export const userIdParamValidation = [
  param("id").isInt().withMessage("User ID must be a number"),
];

const router = express.Router();


// TEST: Admin route
router.get(
  "/ping",
  verifyJWT,
  requireRole("admin"),
  (_req: Request, res: Response) => {
    res.json({ message: "Admin route working ✅" });
  }
);

// ADMIN: Get all users
router.get(
  "/users",
  verifyJWT,
  requireRole("admin"),
  (req: AuthenticatedRequest, res: Response) => {
    return getAllUsers(req, res);
  }
);

// ADMIN: Delete user
router.delete(
  "/users/:id",
  verifyJWT,
  requireRole("admin"),
  userIdParamValidation,
  handleValidationErrors,
  (req: AuthenticatedRequest<{ id: string }>, res: Response) => { deleteUser(req, res);
  }
);

export default router;
