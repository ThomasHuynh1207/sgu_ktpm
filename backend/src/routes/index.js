import express from "express";
import userRoutes from "./userRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import productRoutes from "./productRoutes.js";
import orderRoutes from "./orderRoutes.js";
import cartRoutes from "./cartRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
import paymentRoutes from "./paymentRoutes.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/cart", cartRoutes);
router.use("/reviews", reviewRoutes);
router.use("/payments", paymentRoutes);

export default router;
