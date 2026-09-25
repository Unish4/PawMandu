import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.appUser?.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }
  next();
}
