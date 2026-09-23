import { body, param } from "express-validator";

export const createAddressValidator = [
  body("label")
    .trim()
    .notEmpty()
    .withMessage("Label is required")
    .isLength({ max: 30 }),
  body("city")
    .isIn(["Kathmandu", "Lalitpur", "Bhaktapur"])
    .withMessage("Select a valid city"),
  body("area")
    .trim()
    .notEmpty()
    .withMessage("Area is required")
    .isLength({ max: 100 }),
  body("landmark").optional().trim().isLength({ max: 100 }),
  body("phone")
    .matches(/^(97|98)\d{8}$/)
    .withMessage("Enter a valid 10-digit Nepali mobile number"),
  body("isDefault").optional().isBoolean({ strict: true }).toBoolean(true),
];

export const updateAddressValidator = [
  param("id").isMongoId().withMessage("Invalid address id"),
  body("label").optional().trim().notEmpty().isLength({ max: 30 }),
  body("city").optional().isIn(["Kathmandu", "Lalitpur", "Bhaktapur"]),
  body("area").optional().trim().notEmpty().isLength({ max: 100 }),
  body("landmark").optional().trim().isLength({ max: 100 }),
  body("phone")
    .optional()
    .matches(/^(97|98)\d{8}$/)
    .withMessage("Enter a valid 10-digit Nepali mobile number"),
  body("isDefault").optional().isBoolean({ strict: true }).toBoolean(true),
];
