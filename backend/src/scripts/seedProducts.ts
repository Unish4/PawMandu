import mongoose from "mongoose";
import { ENV } from "../config/env.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";

interface SeedProduct {
  name: string;
  species: "dog" | "cat" | "fish";
  categoryName: string;
  price: number;
  stock: number;
  description: string;
}

const PRODUCTS: SeedProduct[] = [
  {
    name: "PawMandu Chicken & Rice Dry Dog Food 3kg",
    species: "dog",
    categoryName: "Dry food",
    price: 1450,
    stock: 24,
    description:
      "Balanced adult dog food with real chicken as the first ingredient, no artificial colors.",
  },
  {
    name: "PawMandu Puppy Starter Kibble 1.5kg",
    species: "dog",
    categoryName: "Dry food",
    price: 950,
    stock: 18,
    description:
      "Smaller kibble size formulated for puppies up to 12 months, with added DHA for development.",
  },
  {
    name: "PawMandu Senior Dog Formula 3kg",
    species: "dog",
    categoryName: "Dry food",
    price: 1600,
    stock: 10,
    description:
      "Lower-calorie recipe with glucosamine for joint support in dogs aged 7 and above.",
  },

  {
    name: "PawMandu Beef Jerky Strips 200g",
    species: "dog",
    categoryName: "Treats",
    price: 380,
    stock: 30,
    description:
      "Slow-dried beef strips with no added preservatives, great for training rewards.",
  },
  {
    name: "PawMandu Dental Chew Sticks (Pack of 6)",
    species: "dog",
    categoryName: "Treats",
    price: 420,
    stock: 22,
    description:
      "Textured chews that help reduce plaque buildup during regular chewing.",
  },
  {
    name: "PawMandu Peanut Butter Biscuits 250g",
    species: "dog",
    categoryName: "Treats",
    price: 300,
    stock: 26,
    description:
      "Oven-baked biscuits made with real peanut butter, no xylitol.",
  },

  {
    name: "PawMandu Rubber Chew Ball",
    species: "dog",
    categoryName: "Toys",
    price: 350,
    stock: 20,
    description:
      "Durable natural rubber ball sized for medium to large breeds.",
  },
  {
    name: "PawMandu Rope Tug Toy",
    species: "dog",
    categoryName: "Toys",
    price: 280,
    stock: 25,
    description: "Triple-braided cotton rope for tug-of-war and light chewing.",
  },
  {
    name: "PawMandu Squeaky Plush Fox",
    species: "dog",
    categoryName: "Toys",
    price: 420,
    stock: 15,
    description:
      "Soft plush toy with an internal squeaker, best for smaller dogs.",
  },

  {
    name: "PawMandu Adjustable Nylon Collar (M)",
    species: "dog",
    categoryName: "Collars & leashes",
    price: 450,
    stock: 20,
    description:
      "Adjustable collar with a quick-release buckle, fits 30–45cm neck sizes.",
  },
  {
    name: "PawMandu Padded Walking Leash 1.5m",
    species: "dog",
    categoryName: "Collars & leashes",
    price: 650,
    stock: 16,
    description:
      "Cushioned handle leash with a reinforced clip for daily walks.",
  },

  {
    name: "PawMandu Oatmeal Shampoo 250ml",
    species: "dog",
    categoryName: "Grooming",
    price: 480,
    stock: 18,
    description: "Soap-free formula for sensitive skin, mild oatmeal scent.",
  },
  {
    name: "PawMandu Deshedding Brush",
    species: "dog",
    categoryName: "Grooming",
    price: 550,
    stock: 12,
    description:
      "Stainless steel undercoat brush for reducing loose fur during shedding season.",
  },

  {
    name: "PawMandu Stainless Steel Bowl Set (2pc)",
    species: "dog",
    categoryName: "Bowls & accessories",
    price: 500,
    stock: 20,
    description: "Non-tip, rust-resistant bowl set for food and water.",
  },
  {
    name: "PawMandu Slow Feeder Bowl",
    species: "dog",
    categoryName: "Bowls & accessories",
    price: 550,
    stock: 14,
    description:
      "Ridged interior design to slow down fast eaters and reduce bloating risk.",
  },

  {
    name: "PawMandu Tuna Flavour Dry Cat Food 1.5kg",
    species: "cat",
    categoryName: "Dry/wet food",
    price: 1100,
    stock: 22,
    description:
      "Complete adult cat food with tuna as the primary protein source.",
  },
  {
    name: "PawMandu Chicken Pate Wet Food 85g (Pack of 6)",
    species: "cat",
    categoryName: "Dry/wet food",
    price: 650,
    stock: 20,
    description:
      "Grain-free pate in easy-open tins, suitable for all life stages.",
  },
  {
    name: "PawMandu Kitten Growth Formula 1kg",
    species: "cat",
    categoryName: "Dry/wet food",
    price: 850,
    stock: 16,
    description: "Higher-protein kibble sized for kittens up to 12 months.",
  },

  {
    name: "PawMandu Freeze-Dried Chicken Bites 40g",
    species: "cat",
    categoryName: "Treats",
    price: 350,
    stock: 24,
    description: "Single-ingredient freeze-dried chicken breast, no additives.",
  },
  {
    name: "PawMandu Salmon Crunch Treats 100g",
    species: "cat",
    categoryName: "Treats",
    price: 290,
    stock: 28,
    description: "Crunchy salmon-flavoured treats for everyday rewarding.",
  },

  {
    name: "PawMandu Feather Wand Toy",
    species: "cat",
    categoryName: "Toys",
    price: 250,
    stock: 18,
    description:
      "Interactive wand with natural feathers for chase-and-pounce play.",
  },
  {
    name: "PawMandu Catnip Mice (Set of 3)",
    species: "cat",
    categoryName: "Toys",
    price: 320,
    stock: 22,
    description: "Soft plush mice filled with dried catnip.",
  },

  {
    name: "PawMandu Clumping Cat Litter 5L",
    species: "cat",
    categoryName: "Litter",
    price: 650,
    stock: 20,
    description: "Low-dust bentonite litter with strong odor control.",
  },
  {
    name: "PawMandu Silica Gel Crystal Litter 4L",
    species: "cat",
    categoryName: "Litter",
    price: 750,
    stock: 14,
    description:
      "Highly absorbent silica crystals, lasts longer between changes.",
  },

  {
    name: "PawMandu Waterless Cat Shampoo Spray 200ml",
    species: "cat",
    categoryName: "Grooming",
    price: 420,
    stock: 16,
    description: "No-rinse cleansing spray for cats that dislike bathing.",
  },
  {
    name: "PawMandu Ceramic Cat Bowl",
    species: "cat",
    categoryName: "Bowls & accessories",
    price: 380,
    stock: 18,
    description:
      "Wide, shallow ceramic bowl designed to avoid whisker fatigue.",
  },

  {
    name: "PawMandu Tropical Flakes 100g",
    species: "fish",
    categoryName: "Food",
    price: 280,
    stock: 25,
    description: "Daily flake food formulated for community tropical fish.",
  },
  {
    name: "PawMandu Goldfish Pellets 150g",
    species: "fish",
    categoryName: "Food",
    price: 260,
    stock: 20,
    description:
      "Slow-sinking pellets sized for goldfish and similar coldwater species.",
  },

  {
    name: "PawMandu Aquarium Gravel 1kg (Natural)",
    species: "fish",
    categoryName: "Aquarium accessories",
    price: 350,
    stock: 15,
    description:
      "Rounded natural gravel, safe for most freshwater tank setups.",
  },
  {
    name: "PawMandu Water Conditioner 100ml",
    species: "fish",
    categoryName: "Water treatment",
    price: 320,
    stock: 18,
    description:
      "Removes chlorine and chloramine from tap water before adding fish.",
  },
  {
    name: "PawMandu Mini Aquarium Air Pump",
    species: "fish",
    categoryName: "Basic equipment",
    price: 1200,
    stock: 10,
    description:
      "Quiet single-outlet air pump suitable for tanks up to 40 litres.",
  },
];

async function seed() {
  await mongoose.connect(ENV.MONGODB_URI);

  let created = 0;
  let skipped = 0;

  for (const p of PRODUCTS) {
    const category = await Category.findOne({
      name: p.categoryName,
      species: p.species,
    });
    if (!category) {
      console.warn(
        `Skipping "${p.name}" — no category "${p.categoryName}" for "${p.species}". Run seed:categories first?`,
      );
      skipped++;
      continue;
    }

    const exists = await Product.findOne({ name: p.name });
    if (exists) {
      skipped++;
      continue;
    }

    await Product.create({
      name: p.name,
      species: p.species,
      categoryId: category._id,
      price: p.price,
      stock: p.stock,
      description: p.description,
      images: [],
      isActive: true,
    });
    created++;
  }

  console.log(`Seeded ${created} products (${skipped} skipped)`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
