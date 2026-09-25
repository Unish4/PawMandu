import mongoose from "mongoose";
import { Order, type IOrder } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";

export async function cancelOrderAndRestoreStock(
  order: IOrder,
  allowedFrom: IOrder["orderStatus"][] = ["placed", "processing"],
): Promise<IOrder> {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const cancelled = await Order.findOneAndUpdate(
      { _id: order._id, orderStatus: { $in: allowedFrom } },
      { $set: { orderStatus: "cancelled" } },
      { new: true, session },
    );
    if (!cancelled) {
      throw new ApiError(409, "Order can no longer be cancelled");
    }

    for (const item of cancelled.items) {
      const result = await Product.updateOne(
        { _id: item.productId },
        { $inc: { stock: item.quantity } },
        { session },
      );
      if (result.matchedCount === 0) {
        throw new ApiError(
          409,
          "Cannot cancel order because a product no longer exists",
        );
      }
    }

    await session.commitTransaction();

    return cancelled;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
