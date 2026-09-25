import { Request, Response, NextFunction } from "express";
import { Address } from "../models/Address.js";
import { ApiError } from "../utils/ApiError.js";

export const listAddresses = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const addresses = await Address.find({ userId: req.appUser!._id }).sort({
      isDefault: -1,
      createdAt: -1,
    });
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    next(error);
  }
};

export const createAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { label, city, area, landmark, phone, isDefault } = req.body;

    if (isDefault) {
      await Address.updateMany(
        { userId: req.appUser!._id, isDefault: true },
        { isDefault: false },
      );
    }

    const address = await Address.create({
      userId: req.appUser!._id,
      label,
      city,
      area,
      landmark,
      phone,
      isDefault: !!isDefault,
    });

    res.status(201).json({ success: true, address });
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { label, city, area, landmark, phone, isDefault } = req.body;

    const existing = await Address.findOne({
      _id: id,
      userId: req.appUser!._id,
    });
    if (!existing) {
      throw new ApiError(404, "Address not found");
    }

    if (isDefault) {
      await Address.updateMany(
        { userId: req.appUser!._id, isDefault: true, _id: { $ne: id } },
        { isDefault: false },
      );
    }

    if (label !== undefined) existing.label = label;
    if (city !== undefined) existing.city = city;
    if (area !== undefined) existing.area = area;
    if (landmark !== undefined) existing.landmark = landmark;
    if (phone !== undefined) existing.phone = phone;
    if (isDefault !== undefined) existing.isDefault = isDefault;

    await existing.save();
    res.status(200).json({ success: true, address: existing });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const deleted = await Address.findOneAndDelete({
      _id: req.params.id,
      userId: req.appUser!._id,
    });
    if (!deleted) {
      throw new ApiError(404, "Address not found");
    }
    res.status(200).json({ success: true, message: "Address deleted" });
  } catch (error) {
    next(error);
  }
};
