import Product from "../models/Product.js";
import Category from "../models/Category.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ include: Category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, { include: Category });
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi thêm sản phẩm", error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    await product.update(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm", error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    await product.destroy();
    res.json({ message: "Đã xóa sản phẩm" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error: err.message });
  }
};
