import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { ENV } from "../config/env";

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const isApiError = err instanceof ApiError;
  const statusCode = isApiError ? err.statusCode : 500;

  const message =
    isApiError || ENV.NODE_ENV !== "production"
      ? err.message
      : "Something went wrong";

  if (!isApiError) {
    console.error("Unexpected error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(ENV.NODE_ENV !== "production" && { stack: err.stack }),
  });
}
