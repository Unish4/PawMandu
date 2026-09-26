import { Router } from "express";
import { attachUser } from "../middleware/attachUser.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
  getDashboardStats,
  getDashboardAnalytics,
} from "../controllers/adminDashboard.controller.js";
import { dashboardAnalyticsValidator } from "../validators/adminDashboard.validator.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = Router();
router.use(attachUser, requireAdmin);
router.get("/stats", getDashboardStats);
router.get("/analytics", dashboardAnalyticsValidator, validateRequest, getDashboardAnalytics);


export default router;
