import { Request, Response, NextFunction } from "express";
import { Category, Species } from "../models/Category.js";

export const listCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { species } = req.query;
    const filter: Record<string, unknown> = {};

    if (typeof species === "string" && species.trim()) {
      filter.species = species.trim() as Species;
    }

    const categories = await Category.find(filter).sort({
      species: 1,
      name: 1,
    });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};
