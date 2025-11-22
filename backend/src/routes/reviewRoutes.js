import express from "express";
import {
  getReviewsByProduct,
  createReview,
  updateReview,
  deleteReview
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/:productId", getReviewsByProduct);
router.post("/", createReview);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;
