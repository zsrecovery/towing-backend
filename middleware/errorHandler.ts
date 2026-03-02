import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);

  // Postgres unique violation
  if (err.code === "23505") {
    return res.status(400).json({
      error: "DuplicateField",
      message: "This record already exists",
    });
  }

  // Postgres not-null violation
  if (err.code === "23502") {
    return res.status(400).json({
      error: "MissingField",
      message: "Required field is missing",
    });
  }

  return res.status(500).json({
    error: "ServerError",
    message: "Something went wrong",
  });
}