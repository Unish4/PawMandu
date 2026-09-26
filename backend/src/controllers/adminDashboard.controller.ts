import { Request, Response, NextFunction } from "express";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

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

export const getDashboardAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const days = Math.min(90, Math.max(7, Number(req.query.days) || 30));
    const NPT_OFFSET_MS = (5 * 60 + 45) * 60 * 1000;
    const nowNpt = new Date(Date.now() + NPT_OFFSET_MS);
    nowNpt.setUTCHours(0, 0, 0, 0);
    const todayStartUtc = new Date(nowNpt.getTime() - NPT_OFFSET_MS);
    const startDate = new Date(
      todayStartUtc.getTime() - (days - 1) * 24 * 60 * 60 * 1000,
    );

    const dailyAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          orderStatus: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Kathmandu",
            },
          },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
    ]);
    const dailyMap = new Map(
      dailyAgg.map((d) => [d._id, { revenue: d.revenue, orders: d.orders }]),
    );

    const dailyStats = [];
    for (let i = 0; i < days; i++) {
      const dNpt = new Date(
        startDate.getTime() + i * 24 * 60 * 60 * 1000 + NPT_OFFSET_MS,
      );
      const key = dNpt.toISOString().slice(0, 10);
      const entry = dailyMap.get(key);
      dailyStats.push({
        date: key,
        revenue: entry?.revenue ?? 0,
        orders: entry?.orders ?? 0,
      });
    }

    const topProductsAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          orderStatus: { $ne: "cancelled" },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          quantity: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
    ]);

    const topProductsByQuantity = [...topProductsAgg]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
    const topProductsByRevenue = [...topProductsAgg]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    res
      .status(200)
      .json({
        success: true,
        analytics: { dailyStats, topProductsByQuantity, topProductsByRevenue },
      });
  } catch (error) {
    next(error);
  }
};
