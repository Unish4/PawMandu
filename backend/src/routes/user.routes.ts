import { Router } from "express";
import { attachUser } from "../middleware/attachUser.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { updateProfileValidator } from "../validators/user.validator.js";
import { getMe, updateProfile } from "../controllers/user.controller.js";

const router = Router();

router.get("/me", attachUser, getMe);
router.patch(
  "/me",
  attachUser,
  updateProfileValidator,
  validateRequest,
  updateProfile,
);

router.get("/admin-check", attachUser, requireAdmin, (req, res) => {
  res.status(200).json({ success: true, message: "You are an admin" });
});

export default router;
