import { Request, Response, NextFunction } from "express";
import { Order } from "../models/Order";
import { Product } from "../models/Product";

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const NPT_OFFSET_MS = (5 * 60 + 45) * 60 * 1000;
    const nowNpt = new Date(Date.now() + NPT_OFFSET_MS);
    nowNpt.setUTCHours(0, 0, 0, 0);
    const startOfToday = new Date(nowNpt.getTime() - NPT_OFFSET_MS);

    const [ordersToday, revenueAgg, pendingVerifications, lowStockCount] =
      await Promise.all([
        Order.countDocuments({ createdAt: { $gte: startOfToday } }),
        Order.aggregate([
          {
            $match: {
              createdAt: { $gte: startOfToday },
              orderStatus: { $ne: "cancelled" },
            },
          },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
        Order.countDocuments({
          paymentStatus: "pending",
          orderStatus: { $ne: "cancelled" },
        }),
        Product.countDocuments({ isActive: true, stock: { $gte: 0, $lte: 5 } }),
      ]);

    res.status(200).json({
      success: true,
      stats: {
        ordersToday,
        revenueToday: revenueAgg[0]?.total ?? 0,
        pendingVerifications,
        lowStockCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
