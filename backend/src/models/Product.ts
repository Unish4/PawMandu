import { Schema, model, Document, Types } from "mongoose";
import { slugify } from "../utils/slugify";
import type { Species } from "./Category";

export interface IProduct extends Document {
  name: string;
  slug: string;
  species: Species;
  categoryId: Types.ObjectId;
  price: number;
  stock: number;
  description?: string;
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },
    slug: { type: String, required: true, unique: true },
    species: {
      type: String,
      enum: {
        values: ["dog", "cat", "fish"],
        message: "{VALUE} is not a supported species",
      },
      required: true,
      index: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    description: { type: String, trim: true, maxlength: 2000 },
    images: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

productSchema.pre("validate", function () {
  if (this.isModified("name") || !this.slug) {
    if (this.name) {
      const slug = slugify(this.name);
      if (!slug) {
        this.invalidate(
          "name",
          "Name must contain at least one letter or number",
        );
        return;
      }
      this.slug = slug;
    }
  }
});

export const Product = model<IProduct>("Product", productSchema);
