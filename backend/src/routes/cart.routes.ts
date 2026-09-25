import { Router } from "express";
import { attachUser } from "../middleware/attachUser.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  addToCartValidator,
  updateCartItemValidator,
} from "../validators/cart.validator.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cart.controller.js";

const router = Router();

router.use(attachUser); 

router.get("/", getCart);
router.post("/items", addToCartValidator, validateRequest, addToCart);
router.patch(
  "/items/:productId",
  updateCartItemValidator,
  validateRequest,
  updateCartItem,
);
router.delete("/items/:productId", removeCartItem);

export default router;
