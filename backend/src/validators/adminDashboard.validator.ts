import { query } from "express-validator";

export const dashboardAnalyticsValidator = [
  query("days")
    .optional()
    .isInt({ min: 7, max: 90 })
    .withMessage("days must be between 7 and 90"),
];
