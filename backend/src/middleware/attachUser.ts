import { Request, Response, NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";

import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

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

    let appUser = await User.findOne({ clerkId: userId });

    if (!appUser) {
      try {
        const clerkUser = await clerkClient.users.getUser(userId);
        const primaryEmailId = clerkUser.primaryEmailAddressId;
        const emailObj =
          clerkUser.emailAddresses.find((e) => e.id === primaryEmailId) ||
          clerkUser.emailAddresses[0];
        const email = emailObj?.emailAddress || "";
        const name =
          [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
          clerkUser.username ||
          "User";
        const phone = clerkUser.phoneNumbers[0]?.phoneNumber;

        appUser = await User.findOneAndUpdate(
          { clerkId: userId },
          {
            clerkId: userId,
            email,
            name,
            phone,
            role: "customer",
          },
          { upsert: true, new: true },
        );
      } catch (clerkErr) {
        console.error("Failed to auto-sync user from Clerk:", clerkErr);
      }
    }

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
