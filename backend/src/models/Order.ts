import { Schema, model, Document, Types } from "mongoose";

export type OrderStatus = "placed" | "processing" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "verified";

interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

interface IAddressSnapshot {
  label: string;
  city: string;
  area: string;
  landmark?: string;
  phone: string;
}

export interface IOrder extends Document {
  userId: Types.ObjectId;
  orderNumber: string;
  items: IOrderItem[];
  address: IAddressSnapshot;
  deliveryInstructions?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  idempotencyKey: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const addressSnapshotSchema = new Schema<IAddressSnapshot>(
  {
    label: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, required: true },
    landmark: { type: String },
    phone: { type: String, required: true },
  },
  { _id: false },
);

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    orderNumber: { type: String, required: true, unique: true },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (v: unknown[]) => v.length > 0,
        message: "Order must have at least one item",
      },
    },
    address: { type: addressSnapshotSchema, required: true },
    deliveryInstructions: { type: String, maxlength: 300 },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: ["placed", "processing", "delivered", "cancelled"],
      default: "placed",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "verified"],
      default: "pending",
    },
    idempotencyKey: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true },
);

export const Order = model<IOrder>("Order", orderSchema);
