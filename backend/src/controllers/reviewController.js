import Review from "../models/Review.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { product_id: req.params.productId },
      include: [User],
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy đánh giá", error: err.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tạo đánh giá", error: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);
    if (!review) return res.status(404).json({ message: "Không tìm thấy đánh giá để xóa" });

    await review.destroy();
    res.json({ message: "Xóa đánh giá thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa đánh giá", error: err.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findByPk(id);
    if (!review) return res.status(404).json({ message: "Không tìm thấy đánh giá để cập nhật" });

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    await review.save();

    res.json({ message: "Cập nhật đánh giá thành công", review });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật đánh giá", error: err.message });
  }
};