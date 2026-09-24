import { Router } from "express";
import { attachUser } from "../middleware/attachUser";
import { requireAdmin } from "../middleware/requireAdmin";
import { validateRequest } from "../middleware/validateRequest";
import {
  listAdminOrdersValidator,
  updateOrderStatusValidator,
} from "../validators/adminOrder.validator";
import {
  listAdminOrders,
  getAdminOrderById,
  verifyPayment,
  updateOrderStatus,
} from "../controllers/adminOrder.controller";

const router = Router();

router.use(attachUser, requireAdmin); // every route below requires an admin, no exceptions

router.get("/", listAdminOrdersValidator, validateRequest, listAdminOrders);
router.get("/:id", getAdminOrderById);
router.patch("/:id/verify-payment", verifyPayment);
router.patch(
  "/:id/status",
  updateOrderStatusValidator,
  validateRequest,
  updateOrderStatus,
);

export default router;
