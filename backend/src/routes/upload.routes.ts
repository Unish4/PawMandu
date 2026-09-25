import { Router } from "express";
import { attachUser } from "../middleware/attachUser.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { upload } from "../middleware/uploadValidation.js";
import {
  uploadProductImage,
  deleteProductImage,
} from "../controllers/upload.controller.js";
import { uploadLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.use(attachUser, requireAdmin);

router.post(
  "/products",
  uploadLimiter,
  upload.single("image"),
  uploadProductImage,
);

router.delete("/products/:publicId", deleteProductImage);

export default router;
