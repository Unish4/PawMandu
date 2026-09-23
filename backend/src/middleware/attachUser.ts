import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";

import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";

export const attachUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      throw new ApiError(401, "Not authenticated");
    }

    const appUser = await User.findOne({ clerkId: userId });

    if (!appUser) {
      throw new ApiError(
        404,
        "User record not found — please try again in a moment",
      );
    }

    req.appUser = appUser;

    next();
  } catch (error) {
    next(error);
  }
};
