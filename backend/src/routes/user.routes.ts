import { Router } from "express";
import { attachUser } from "../middleware/attachUser";
import { requireAdmin } from "../middleware/requireAdmin";

const router = Router();

router.get("/me", attachUser, (req, res) => {
  res.status(200).json({ success: true, user: req.appUser });
});

router.get("/admin-check", attachUser, requireAdmin, (req, res) => {
  res.status(200).json({ success: true, message: "You are an admin" });
});

export default router;
