import { Router } from "express";
import { attachUser } from "../middleware/attachUser.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createReviewValidator,
  updateReviewValidator,
} from "../validators/review.validator.js";
import {
  listProductReviews,
  getMyReviewStatus,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";

export const reviewRouter = Router({ mergeParams: true });
reviewRouter.get("/", listProductReviews);
reviewRouter.get("/me", attachUser, getMyReviewStatus);
reviewRouter.post(
  "/",
  attachUser,
  createReviewValidator,
  validateRequest,
  createReview,
);

export const reviewByIdRouter = Router();
reviewByIdRouter.patch(
  "/:id",
  attachUser,
  updateReviewValidator,
  validateRequest,
  updateReview,
);
reviewByIdRouter.delete("/:id", attachUser, deleteReview);
