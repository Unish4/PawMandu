import { body, query } from "express-validator";

export const listAdminOrdersValidator = [
  query("orderStatus")
    .optional()
    .isIn(["placed", "processing", "delivered", "cancelled"]),
  query("paymentStatus").optional().isIn(["pending", "verified"]),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 50 }),
];

export const updateOrderStatusValidator = [
  body("orderStatus")
    .isIn(["placed", "processing", "delivered", "cancelled"])
    .withMessage("Invalid order status"),
];
