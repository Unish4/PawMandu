import mongoose from "mongoose";
import { ENV } from "../config/env";
import { Category } from "../models/Category";

const CATEGORIES: { name: string; species: "dog" | "cat" | "fish" }[] = [
  { name: "Dry food", species: "dog" },
  { name: "Treats", species: "dog" },
  { name: "Toys", species: "dog" },
  { name: "Collars & leashes", species: "dog" },
  { name: "Grooming", species: "dog" },
  { name: "Bowls & accessories", species: "dog" },

  { name: "Dry/wet food", species: "cat" },
  { name: "Treats", species: "cat" },
  { name: "Toys", species: "cat" },
  { name: "Litter", species: "cat" },
  { name: "Grooming", species: "cat" },
  { name: "Bowls & accessories", species: "cat" },

  { name: "Food", species: "fish" },
  { name: "Aquarium accessories", species: "fish" },
  { name: "Water treatment", species: "fish" },
  { name: "Basic equipment", species: "fish" },
];

async function seed() {
  await mongoose.connect(ENV.MONGODB_URI);

  for (const cat of CATEGORIES) {
    await Category.findOneAndUpdate(
      { name: cat.name, species: cat.species },
      {
        ...cat,
        slug: `${cat.species}-${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      },
      { upsert: true, new: true },
    );
  }

  console.log(`Seeded ${CATEGORIES.length} categories`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
