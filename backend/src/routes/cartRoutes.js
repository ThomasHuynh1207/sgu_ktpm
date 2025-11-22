import express from "express";
import {
  getCartByUserId,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/:userId", getCartByUserId);
router.post("/", addToCart);
router.put("/:id", updateCartItem);
router.delete("/:id", removeFromCart);
router.delete("/clear/:userId", clearCart);

export default router;
