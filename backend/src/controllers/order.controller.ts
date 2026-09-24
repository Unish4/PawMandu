import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Order } from "../models/Order";
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";
import { Address } from "../models/Address";
import { ApiError } from "../utils/ApiError";
import { calculateDeliveryFee } from "../utils/calculateDeliveryFee";
import { generateOrderNumber } from "../utils/generateOrderNumber";
import { cancelOrderAndRestoreStock } from "../services/order.service";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { addressId, deliveryInstructions, idempotencyKey } = req.body;
    const userId = req.appUser!._id;

    const existingOrder = await Order.findOne({ idempotencyKey, userId });
    if (existingOrder) {
      return res.status(200).json({ success: true, order: existingOrder });
    }

    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) throw new ApiError(404, "Address not found");

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0)
      throw new ApiError(400, "Your cart is empty");

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const orderItems = [];
      let subtotal = 0;

      for (const cartItem of cart.items) {
        const updated = await Product.findOneAndUpdate(
          {
            _id: cartItem.productId,
            stock: { $gte: cartItem.quantity },
            isActive: true,
          },
          { $inc: { stock: -cartItem.quantity } },
          { new: true, session },
        );

        if (!updated) {
          throw new ApiError(
            409,
            "One of the items in your cart is no longer available in that quantity. Please review your cart.",
          );
        }

        orderItems.push({
          productId: updated._id,
          name: updated.name,
          price: updated.price,
          quantity: cartItem.quantity,
        });
        subtotal += updated.price * cartItem.quantity;
      }

      const deliveryFee = calculateDeliveryFee(subtotal);

      const created = await Order.create(
        [
          {
            userId,
            orderNumber: generateOrderNumber(),
            items: orderItems,
            address: {
              label: address.label,
              city: address.city,
              area: address.area,
              landmark: address.landmark,
              phone: address.phone,
            },
            deliveryInstructions,
            subtotal,
            deliveryFee,
            total: subtotal + deliveryFee,
            orderStatus: "placed",
            paymentStatus: "pending",
            idempotencyKey,
          },
        ],
        { session },
      );

      await Cart.findOneAndUpdate({ userId }, { items: [] }, { session });

      await session.commitTransaction();
      res.status(201).json({ success: true, order: created[0] });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    if (
      (error as { code?: number; keyPattern?: Record<string, unknown> })
        ?.code === 11000 &&
      (error as { keyPattern?: Record<string, unknown> }).keyPattern
        ?.idempotencyKey
    ) {
      const existing = await Order.findOne({
        idempotencyKey: req.body.idempotencyKey,
        userId: req.appUser!._id,
      });
      if (existing)
        return res.status(200).json({ success: true, order: existing });
    }
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.appUser!._id,
    });
    if (!order) throw new ApiError(404, "Order not found");
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const listMyOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderStatus, page = "1", limit = "10" } = req.query;

    const filter: Record<string, unknown> = { userId: req.appUser!._id };
    if (orderStatus) filter.orderStatus = orderStatus;

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

export const cancelMyOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.appUser!._id,
    });
    if (!order) throw new ApiError(404, "Order not found");

    if (order.orderStatus !== "placed") {
      throw new ApiError(
        400,
        `This order is already "${order.orderStatus}" and can't be cancelled here — please contact us on WhatsApp`,
      );
    }

    const cancelled = await cancelOrderAndRestoreStock(order, ["placed"]);
    res.status(200).json({ success: true, order: cancelled });
  } catch (error) {
    next(error);
  }
};
