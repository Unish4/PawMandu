import { Schema, model, Document, Types } from "mongoose";

export type AddressCity = "Kathmandu" | "Lalitpur" | "Bhaktapur";

export interface IAddress extends Document {
  userId: Types.ObjectId;
  label: string;
  city: AddressCity;
  area: string;
  landmark?: string;
  phone: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    label: {
      type: String,
      required: [true, "Label is required"],
      trim: true,
      maxlength: 30,
    },
    city: {
      type: String,
      enum: {
        values: ["Kathmandu", "Lalitpur", "Bhaktapur"],
        message: "{VALUE} is not a supported delivery city",
      },
      required: true,
    },
    area: {
      type: String,
      required: [true, "Area is required"],
      trim: true,
      maxlength: 100,
    },
    landmark: { type: String, trim: true, maxlength: 100 },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^(97|98)\d{8}$/, "Enter a valid 10-digit Nepali mobile number"],
    },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Address = model<IAddress>("Address", addressSchema);
