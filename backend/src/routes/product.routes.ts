import { Router } from "express";
import { attachUser } from "../middleware/attachUser.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createProductValidator,
  updateProductValidator,
  listProductsValidator,
} from "../validators/product.validator.js";
import {
  listProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = Router();

router.get("/", listProductsValidator, validateRequest, listProducts);
router.get("/:slug", getProductBySlug);

router.post(
  "/",
  attachUser,
  requireAdmin,
  createProductValidator,
  validateRequest,
  createProduct,
);
router.patch(
  "/:id",
  attachUser,
  requireAdmin,
  updateProductValidator,
  validateRequest,
  updateProduct,
);
router.delete("/:id", attachUser, requireAdmin, deleteProduct);

export default router;
