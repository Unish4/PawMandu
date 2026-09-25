import { Router } from "express";
import { attachUser } from "../middleware/attachUser.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  checkoutValidator,
  listMyOrdersValidator,
} from "../validators/order.validator.js";
import {
  createOrder,
  getOrderById,
  listMyOrders,
  cancelMyOrder,
} from "../controllers/order.controller.js";
import { checkoutLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.use(attachUser);

router.post(
  "/",
  checkoutLimiter,
  checkoutValidator,
  validateRequest,
  createOrder,
);
router.get("/:id", getOrderById);
router.get("/", listMyOrdersValidator, validateRequest, listMyOrders);
router.patch("/:id/cancel", cancelMyOrder);

export default router;
