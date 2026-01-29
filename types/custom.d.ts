// types/custom.d.ts
import type { Request } from "express";
import type { UserPayload } from "./user";

// Generic AuthenticatedRequest
export interface AuthenticatedRequest<P = {}> extends Request<P> {
  user?: UserPayload;
}
