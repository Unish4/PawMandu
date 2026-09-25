import { Router } from "express";
import { attachUser } from "../middleware/attachUser.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
  listAllProductsForAdmin,
  adjustProductStock,
} from "../controllers/adminProduct.controller.js";

const router = Router();
router.use(attachUser, requireAdmin);
router.get("/", listAllProductsForAdmin);
router.patch("/:id/stock", adjustProductStock);

export default router;
