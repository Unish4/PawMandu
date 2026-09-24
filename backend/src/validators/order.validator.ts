import { body } from "express-validator";
import { query } from "express-validator";

export const checkoutValidator = [
  body("addressId").isMongoId().withMessage("Select a delivery address"),
  body("deliveryInstructions").optional().trim().isLength({ max: 300 }),
  body("idempotencyKey")
    .isString()
    .notEmpty()
    .withMessage("Missing idempotency key"),
];

export const listMyOrdersValidator = [
  query("orderStatus")
    .optional()
    .isIn(["placed", "processing", "delivered", "cancelled"]),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 50 }),
];
