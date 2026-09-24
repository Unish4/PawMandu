import { Router } from "express";
import { attachUser } from "../middleware/attachUser";
import { requireAdmin } from "../middleware/requireAdmin";
import { upload } from "../middleware/uploadValidation";
import { uploadProductImage, deleteProductImage  } from "../controllers/upload.controller";

const router = Router();

router.use(attachUser, requireAdmin);

router.post("/products", upload.single("image"), uploadProductImage);

router.delete("/products/:publicId", deleteProductImage);

export default router;
