import { Request, Response, NextFunction } from "express";
import { Product } from "../models/Product";
import { ApiError } from "../utils/ApiError";

export const listAllProductsForAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await Product.find()
      .populate("categoryId", "name species")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

export const adjustProductStock = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { delta } = req.body;

    if (typeof delta !== "number" || !Number.isInteger(delta)) {
      throw new ApiError(400, "Delta must be an integer");
    }

    const filter: Record<string, unknown> = { _id: id };
    if (delta < 0) {
      filter.stock = { $gte: Math.abs(delta) };
    }

    const product = await Product.findOneAndUpdate(
      filter,
      { $inc: { stock: delta } },
      { new: true },
    ).populate("categoryId", "name species");

    if (!product) {
      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        throw new ApiError(404, "Product not found");
      }
      throw new ApiError(400, "Stock cannot go below 0");
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};
