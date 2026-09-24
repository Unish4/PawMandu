import { Router } from "express";
import { attachUser } from "../middleware/attachUser";
import { validateRequest } from "../middleware/validateRequest";
import {
  checkoutValidator,
  listMyOrdersValidator,
} from "../validators/order.validator";
import {
  createOrder,
  getOrderById,
  listMyOrders,
  cancelMyOrder,
} from "../controllers/order.controller";

const router = Router();

router.use(attachUser);

router.post("/", checkoutValidator, validateRequest, createOrder);
router.get("/:id", getOrderById);
router.get("/", listMyOrdersValidator, validateRequest, listMyOrders);
router.patch("/:id/cancel", cancelMyOrder);

export default router;
