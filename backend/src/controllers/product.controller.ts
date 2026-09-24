import { Request, Response, NextFunction } from "express";
import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { ApiError } from "../utils/ApiError";
import { deleteCloudinaryImage } from "../services/cloudinary.service";

export const listProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      species,
      category,
      minPrice,
      maxPrice,
      inStock,
      sort,
      search,
      page = "1",
      limit = "12",
    } = req.query;

    const filter: Record<string, unknown> = { isActive: true };
    if (species) filter.species = species;
    if (category) filter.categoryId = { $in: String(category).split(",") };
    if (inStock === "true") filter.stock = { $gt: 0 };
    if (minPrice || maxPrice) {
      filter.price = {
        ...(minPrice && { $gte: Number(minPrice) }),
        ...(maxPrice && { $lte: Number(maxPrice) }),
      };
    }
    if (search) {
      filter.name = { $regex: String(search), $options: "i" };
    }
    const sortMap: Record<string, Record<string, 1 | -1>> = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      newest: { createdAt: -1 },
    };
    const sortOption = sortMap[String(sort)] ?? { createdAt: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("categoryId", "name species")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      products,
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

export const getProductBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    }).populate("categoryId", "name species");
    if (!product) throw new ApiError(404, "Product not found");
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

async function assertCategoryMatchesSpecies(
  categoryId: string,
  species: string,
) {
  const category = await Category.findById(categoryId);
  if (!category) throw new ApiError(400, "Category not found");
  if (category.species !== species) {
    throw new ApiError(
      400,
      `Category "${category.name}" belongs to ${category.species}, not ${species}`,
    );
  }
}

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      name,
      species,
      categoryId,
      price,
      stock,
      description,
      images,
      isActive,
    } = req.body;

    await assertCategoryMatchesSpecies(categoryId, species);

    const product = await Product.create({
      name,
      species,
      categoryId,
      price,
      stock,
      description,
      images,
      isActive,
    });
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) throw new ApiError(404, "Product not found");

    const previousImages = [...existing.images];

    const { species, categoryId, images: newImages } = req.body;
    if (species || categoryId) {
      await assertCategoryMatchesSpecies(
        categoryId ?? existing.categoryId.toString(),
        species ?? existing.species,
      );
    }

    Object.assign(existing, req.body);
    await existing.save();

    if (newImages && Array.isArray(newImages)) {
      const newPublicIds = new Set(
        newImages.map((img: string | { publicId: string }) =>
          typeof img === "string" ? img : img.publicId,
        ),
      );
      const removedImages = previousImages.filter(
        (img) => !newPublicIds.has(img.publicId),
      );
      for (const img of removedImages) {
        void deleteCloudinaryImage(img.publicId).catch(() => {});
      }
    }
    
    res.status(200).json({ success: true, product: existing });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) throw new ApiError(404, "Product not found");

    for (const img of deleted.images) {
      void deleteCloudinaryImage(img.publicId).catch(() => {});
    }

    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};
