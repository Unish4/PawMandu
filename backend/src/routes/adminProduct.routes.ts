import { Router } from "express";
import { attachUser } from "../middleware/attachUser";
import { requireAdmin } from "../middleware/requireAdmin";
import {
  listAllProductsForAdmin,
  adjustProductStock,
} from "../controllers/adminProduct.controller";

const router = Router();
router.use(attachUser, requireAdmin);
router.get("/", listAllProductsForAdmin);
router.patch("/:id/stock", adjustProductStock);

export default router;
