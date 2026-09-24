import { body } from "express-validator";

export const checkoutValidator = [
  body("addressId").isMongoId().withMessage("Select a delivery address"),
  body("deliveryInstructions").optional().trim().isLength({ max: 300 }),
  body("idempotencyKey")
    .isString()
    .notEmpty()
    .withMessage("Missing idempotency key"),
];
