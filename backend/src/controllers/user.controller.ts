import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";

export const getMe = async (req: Request, res: Response) => {
  res.status(200).json({ success: true, user: req.appUser });
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, phone } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.appUser!._id,
      {
        $set: {
          ...(name !== undefined && { name }),
          ...(phone !== undefined && { phone }),
        },
      },
      { new: true, runValidators: true },
    );

    res.status(200).json({ success: true, user: updated });
  } catch (error) {
    next(error);
  }
};
