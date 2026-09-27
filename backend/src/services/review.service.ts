import mongoose from "mongoose";
import { Review } from "../models/Review.js";
import { Product } from "../models/Product.js";

export async function recalculateProductRating(productId: string) {
  const [result] = await Review.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  await Product.findByIdAndUpdate(productId, {
    averageRating: result ? Math.round(result.avg * 10) / 10 : 0,
    reviewCount: result?.count ?? 0,
  });
}
