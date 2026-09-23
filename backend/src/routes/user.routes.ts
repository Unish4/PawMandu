import { Router } from "express";
import { attachUser } from "../middleware/attachUser";
import { requireAdmin } from "../middleware/requireAdmin";
import { validateRequest } from "../middleware/validateRequest";
import { updateProfileValidator } from "../validators/user.validator";
import { getMe, updateProfile } from "../controllers/user.controller";

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
