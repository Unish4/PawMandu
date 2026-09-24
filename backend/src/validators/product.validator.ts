import { body, query } from "express-validator";

export const createProductValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 }),
  body("species")
    .isIn(["dog", "cat", "fish"])
    .withMessage("Select a valid species"),
  body("categoryId").isMongoId().withMessage("Invalid category"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be 0 or greater"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be 0 or greater"),
  body("description").optional().trim().isLength({ max: 2000 }),
  body("images").optional().isArray().withMessage("Images must be an array"),
  body("images.*").isObject().withMessage("Each image must be an object"),
  body("images.*.url").isURL().withMessage("Image URL is invalid"),
  body("images.*.publicId").isString().notEmpty(),
  body("isActive").optional().isBoolean(),
];

export const updateProductValidator = [
  body("name").optional().trim().notEmpty().isLength({ max: 100 }),
  body("species").optional().isIn(["dog", "cat", "fish"]),
  body("categoryId").optional().isMongoId(),
  body("price").optional().isFloat({ min: 0 }),
  body("stock").optional().isInt({ min: 0 }),
  body("description").optional().trim().isLength({ max: 2000 }),
  body("images").optional().isArray().withMessage("Images must be an array"),
  body("images.*").isObject().withMessage("Each image must be an object"),
  body("images.*.url").isURL().withMessage("Image URL is invalid"),
  body("images.*.publicId").isString().notEmpty(),
  body("isActive").optional().isBoolean(),
];

export const listProductsValidator = [
  query("species").optional().isIn(["dog", "cat", "fish"]),
  query("minPrice").optional().isFloat({ min: 0 }),
  query("maxPrice").optional().isFloat({ min: 0 }),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 50 }),
  query("search").optional().trim().isLength({ max: 100 }),
];
