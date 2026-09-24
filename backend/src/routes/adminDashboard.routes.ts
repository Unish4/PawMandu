import { Router } from "express";
import { attachUser } from "../middleware/attachUser";
import { requireAdmin } from "../middleware/requireAdmin";
import { getDashboardStats } from "../controllers/adminDashboard.controller";

const router = Router();
router.use(attachUser, requireAdmin);
router.get("/stats", getDashboardStats);

export default router;
