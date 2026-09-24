import { Router } from "express";
import { attachUser } from "../middleware/attachUser";
import { validateRequest } from "../middleware/validateRequest";
import { checkoutValidator } from "../validators/order.validator";
import { createOrder, getOrderById } from "../controllers/order.controller";

const router = Router();

router.use(attachUser);

router.post("/", checkoutValidator, validateRequest, createOrder);
router.get("/:id", getOrderById);

export default router;
