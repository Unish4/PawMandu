import { body, param } from "express-validator";

export const createReviewValidator = [
  param("productId").isMongoId().withMessage("Invalid product id"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment").optional().trim().isLength({ max: 1000 }),
];

export const updateReviewValidator = [
  param("id").isMongoId().withMessage("Invalid review id"),
  body("rating").optional().isInt({ min: 1, max: 5 }),
  body("comment").optional().trim().isLength({ max: 1000 }),
];
