import { Router } from "express";
import { attachUser } from "../middleware/attachUser.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { getDashboardStats } from "../controllers/adminDashboard.controller.js";

const router = Router();
router.use(attachUser, requireAdmin);
router.get("/stats", getDashboardStats);

export default router;
