import { Request, Response, NextFunction } from "express";
import { aj } from "../config/arcjet.js";
import { ApiError } from "../utils/ApiError.js";

export async function arcjetProtect(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit())
        return next(new ApiError(429, "Too many requests — please slow down"));
      if (decision.reason.isBot())
        return next(new ApiError(403, "Automated access isn't allowed here"));
      return next(new ApiError(403, "Request blocked for security reasons"));
    }

    next();
  } catch (error) {
    console.error("Arcjet check failed, allowing request through:", error);
    next();
  }
}
