import { Request, Response, NextFunction } from "express";
import { Cart, type ICartItem } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";
import { calculateDeliveryFee } from "../utils/calculateDeliveryFee.js";

async function getOrCreateCart(userId: string) {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
}

async function buildCartResponse(items: ICartItem[]) {
  const productIds = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  const resolvedItems = items.map((item) => {
    const product = productMap.get(item.productId.toString());

    if (!product || !product.isActive) {
      return {
        productId: item.productId,
        quantity: item.quantity,
        product: null,
        issue: "unavailable" as const,
      };
    }

    const issue =
      item.quantity > product.stock ? ("insufficient_stock" as const) : null;

    return {
      productId: item.productId,
      quantity: item.quantity,
      product: {
        name: product.name,
        price: product.price,
        stock: product.stock,
        slug: product.slug,
        images: product.images,
      },
      issue,
    };
  });

  const subtotal = resolvedItems.reduce((sum, item) => {
    if (!item.product) return sum;
    const usableQty =
      item.issue === "insufficient_stock" ? item.product.stock : item.quantity;
    return sum + item.product.price * usableQty;
  }, 0);

  const deliveryFee = calculateDeliveryFee(subtotal);
  return {
    items: resolvedItems,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
  };
}

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cart = await getOrCreateCart(req.appUser!._id.toString());
    const response = await buildCartResponse(cart.items);
    res.status(200).json({ success: true, cart: response });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive)
      throw new ApiError(404, "Product not found");
    if (quantity > product.stock) {
      throw new ApiError(400, `Only ${product.stock} left in stock`);
    }

    const cart = await getOrCreateCart(req.appUser!._id.toString());
    const existing = cart.items.find(
      (i) => i.productId.toString() === productId,
    );

    if (existing) {
      const newQuantity = existing.quantity + quantity;
      if (newQuantity > product.stock) {
        throw new ApiError(
          400,
          `Only ${product.stock} left in stock — you already have ${existing.quantity} in your cart`,
        );
      }
      existing.quantity = newQuantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    const response = await buildCartResponse(cart.items);
    res.status(200).json({ success: true, cart: response });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive)
      throw new ApiError(404, "Product not found");
    if (quantity > product.stock)
      throw new ApiError(400, `Only ${product.stock} left in stock`);

    const cart = await getOrCreateCart(req.appUser!._id.toString());
    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) throw new ApiError(404, "Item not in cart");

    item.quantity = quantity;
    await cart.save();

    const response = await buildCartResponse(cart.items);
    res.status(200).json({ success: true, cart: response });
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const cart = await getOrCreateCart(req.appUser!._id.toString());

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    await cart.save();

    const response = await buildCartResponse(cart.items);
    res.status(200).json({ success: true, cart: response });
  } catch (error) {
    next(error);
  }
};
