import { Schema, model, Document } from "mongoose";

export type Species = "dog" | "cat" | "fish";

export interface ICategory extends Document {
  name: string;
  slug: string;
  species: Species;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true, maxlength: 50 },
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
  },
  { timestamps: true },
);

categorySchema.index({ name: 1, species: 1 }, { unique: true });

export const Category = model<ICategory>("Category", categorySchema);
