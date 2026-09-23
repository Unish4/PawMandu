import { body } from "express-validator";

export const updateProfileValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be 2–50 characters"),
  body("phone")
    .optional({ values: "falsy" })
    .trim()
    .matches(/^(97|98)\d{8}$/)
    .withMessage("Enter a valid 10-digit Nepali mobile number"),
];
