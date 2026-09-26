import { Request, Response, NextFunction } from "express";
import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { isValidTransition } from "../constants/orderTransitions.js";
import { cancelOrderAndRestoreStock } from "../services/order.service.js";
import {
  sendPaymentVerifiedEmail,
  sendOrderDeliveredEmail,
} from "../services/email.service.js";

export const listAdminOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderStatus, paymentStatus, page = "1", limit = "20" } = req.query;

    const filter: Record<string, unknown> = {};
    if (orderStatus) filter.orderStatus = orderStatus;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) throw new ApiError(404, "Order not found");
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) throw new ApiError(404, "Order not found");

    if (order.paymentStatus === "verified") {
      return res
        .status(200)
        .json({ success: true, order, message: "Already verified" });
    }

    order.paymentStatus = "verified";
    await order.save();

    void (async () => {
      try {
        const customer = await User.findById(order.userId);
        if (customer) await sendPaymentVerifiedEmail(order, customer.email);
      } catch (err) {
        console.error(
          `Failed to send payment verified email for ${order.orderNumber}:`,
          err,
        );
      }
    })();

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) throw new ApiError(404, "Order not found");

    if (!isValidTransition(order.orderStatus, orderStatus)) {
      throw new ApiError(
        400,
        `Cannot move an order from "${order.orderStatus}" to "${orderStatus}"`,
      );
    }

    let updatedOrder;
    if (orderStatus === "cancelled") {
      updatedOrder = await cancelOrderAndRestoreStock(order);
    } else {
      updatedOrder = await Order.findOneAndUpdate(
        { _id: order._id, orderStatus: order.orderStatus },
        { $set: { orderStatus } },
        { new: true },
      );
      if (!updatedOrder) {
        throw new ApiError(409, "Order status changed, please refresh");
      }
    }

    if (orderStatus === "delivered") {
      void (async () => {
        try {
          const customer = await User.findById(updatedOrder.userId);
          if (customer)
            await sendOrderDeliveredEmail(updatedOrder, customer.email);
        } catch (err) {
          console.error(
            `Failed to send order delivered email for ${updatedOrder.orderNumber}:`,
            err,
          );
        }
      })();
    }

    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    next(error);
  }
};
