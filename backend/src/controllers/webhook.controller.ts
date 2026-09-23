import { Request, Response, NextFunction } from "express";
import { Webhook } from "svix";
import { User } from "../models/User";
import { ENV } from "../config/env";
import { ApiError } from "../utils/ApiError";

interface ClerkUserPayload {
  id: string;
  email_addresses: { email_address: string }[];
  first_name: string | null;
  last_name: string | null;
  phone_numbers: { phone_number: string }[];
}

interface ClerkWebhookEvent {
  type: string;
  data: ClerkUserPayload;
}

export const handleClerkWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const svixId = req.header("svix-id");
    const svixTimestamp = req.header("svix-timestamp");
    const svixSignature = req.header("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      throw new ApiError(400, "Missing svix headers");
    }

    const wh = new Webhook(ENV.CLERK.WEBHOOK_SECRET);

    let event: ClerkWebhookEvent;
    try {
      event = wh.verify(req.body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as unknown as ClerkWebhookEvent;
    } catch (err) {
      throw new ApiError(400, "Invalid webhook signature");
    }

    const { type, data } = event;

    if (type === "user.created" || type === "user.updated") {
      const name =
        [data.first_name, data.last_name].filter(Boolean).join(" ") ||
        "Unnamed";

      await User.findOneAndUpdate(
        { clerkId: data.id },
        {
          clerkId: data.id,
          email: data.email_addresses[0]?.email_address ?? "",
          name,
          phone: data.phone_numbers[0]?.phone_number,
        },
        { upsert: true, new: true },
      );
    }

    if (type === "user.deleted") {
      await User.deleteOne({ clerkId: data.id });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
