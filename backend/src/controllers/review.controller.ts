import { Request, Response, NextFunction } from "express";
import { Review } from "../models/Review.js";
import { Order } from "../models/Order.js";
import { ApiError } from "../utils/ApiError.js";
import { recalculateProductRating } from "../services/review.service.js";

export const listProductReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews: reviews.map((r) => ({
        _id: r._id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        reviewerName: (r.userId as any)?.name?.split(" ")[0] ?? "Customer",
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const getMyReviewStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const userId = req.appUser!._id;

    const [existingReview, qualifyingOrder] = await Promise.all([
      Review.findOne({ productId, userId }),
      Order.findOne({
        userId,
        orderStatus: "delivered",
        paymentStatus: "verified",
        "items.productId": productId,
      }),
    ]);

    res.status(200).json({
      success: true,
      canReview: !!qualifyingOrder && !existingReview,
      existingReview,
    });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productId = req.params.productId as string;
    const { rating, comment } = req.body;
    const userId = req.appUser!._id;

    const qualifyingOrder = await Order.findOne({
      userId,
      orderStatus: "delivered",
      paymentStatus: "verified",
      "items.productId": productId,
    });
    if (!qualifyingOrder)
      throw new ApiError(
        403,
        "You can only review products that have been delivered to you",
      );

    const existing = await Review.findOne({ productId, userId });
    if (existing)
      throw new ApiError(
        409,
        "You've already reviewed this product — edit your existing review instead",
      );

    const review = await Review.create({
      productId,
      userId,
      orderId: qualifyingOrder._id,
      rating,
      comment,
    });
    await recalculateProductRating(productId);

    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      userId: req.appUser!._id,
    });
    if (!review) throw new ApiError(404, "Review not found");

    if (req.body.rating !== undefined) review.rating = req.body.rating;
    if (req.body.comment !== undefined) review.comment = req.body.comment;
    await review.save();
    await recalculateProductRating(review.productId.toString());

    res.status(200).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const filter =
      req.appUser!.role === "admin"
        ? { _id: req.params.id }
        : { _id: req.params.id, userId: req.appUser!._id };

    const review = await Review.findOneAndDelete(filter);
    if (!review) throw new ApiError(404, "Review not found");
    await recalculateProductRating(review.productId.toString());

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    next(error);
  }
};
