import { Request, Response, NextFunction } from "express";
import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";
import { ApiError } from "../utils/ApiError.js";
import { deleteCloudinaryImage } from "../services/cloudinary.service.js";

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

    const { species, categoryId } = req.body;
    if (species || categoryId) {
      await assertCategoryMatchesSpecies(
        categoryId ?? existing.categoryId.toString(),
        species ?? existing.species,
      );
    }

    const previousImages = existing.images;

    // Explicit per-field assignment — same pattern already used in
    // updateAddress and updateProfile. Only fields actually intended to
    // be admin-editable can ever reach the document, regardless of what
    // else shows up in the request body.
    if (req.body.name !== undefined) existing.name = req.body.name;
    if (req.body.species !== undefined) existing.species = req.body.species;
    if (req.body.categoryId !== undefined) existing.categoryId = req.body.categoryId;
    if (req.body.price !== undefined) existing.price = req.body.price;
    if (req.body.stock !== undefined) existing.stock = req.body.stock;
    if (req.body.description !== undefined) existing.description = req.body.description;
    if (req.body.images !== undefined) existing.images = req.body.images;
    if (req.body.isActive !== undefined) existing.isActive = req.body.isActive;

    await existing.save();

    if (req.body.images !== undefined) {
      const newPublicIds = new Set(
        req.body.images.map((img: { publicId: string }) => img.publicId),
      );
      const removedImages = previousImages.filter(
        (img) => !newPublicIds.has(img.publicId),
      );
      for (const img of removedImages) void deleteCloudinaryImage(img.publicId);
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
