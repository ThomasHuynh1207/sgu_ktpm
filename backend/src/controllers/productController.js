import { Op } from "sequelize";
import { Product, Category } from "../models/associations.js";


// QUAN TRỌNG: Chỉ include tên danh mục, không lấy hết
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category, attributes: ["category_name"] }],
      order: [["created_at", "DESC"]],
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, attributes: ["category_name"] }],
    });
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { product_name, price, category, stock = 0, image, description } = req.body;

    if (!product_name?.trim() || !price) {
      return res.status(400).json({ message: "Tên sản phẩm và giá là bắt buộc" });
    }

    let categoryId = null;
    if (category?.trim()) {
      const [cat] = await Category.findOrCreate({
        where: { category_name: category.trim() },
        defaults: { category_name: category.trim() },
      });
      categoryId = cat.category_id;
    }

    const newProduct = await Product.create({
      product_name: product_name.trim(),
      price: Number(price),
      category_id: categoryId,
      stock: Number(stock),
      image: image?.trim() || null,
      description: description?.trim() || null,
    });

    const productWithCat = await Product.findByPk(newProduct.product_id, {
      include: [{ model: Category, attributes: ["category_name"] }],
    });

    res.status(201).json(productWithCat);
  } catch (err) {
    console.error("Lỗi tạo sản phẩm:", err);
    res.status(500).json({ message: err.message || "Lỗi server" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    const { product_name, price, category, stock, image, description } = req.body;

    let categoryId = product.category_id;

    if (category !== undefined) {
      if (!category || category.trim() === "") {
        categoryId = null;
      } else {
        const [cat] = await Category.findOrCreate({
          where: { category_name: category.trim() },
          defaults: { category_name: category.trim() },
        });
        categoryId = cat.category_id;
      }
    }

    await product.update({
      product_name: product_name?.trim() || product.product_name,
      price: price ? Number(price) : product.price,
      category_id: categoryId,
      stock: stock !== undefined ? Number(stock) : product.stock,
      image: image?.trim() || product.image,
      description: description?.trim() || product.description,
    });

    const updated = await Product.findByPk(product.product_id, {
      include: [{ model: Category, attributes: ["category_name"] }],
    });

    res.json(updated);
  } catch (err) {
    console.error("Lỗi cập nhật:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    await product.destroy();
    res.json({ message: "Đã xóa sản phẩm" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") return res.json([]);

    const keyword = `%${q.trim()}%`;

    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { product_name: { [Op.iLike]: keyword } },
          { description: { [Op.iLike]: keyword } }
        ]
      },
      include: [
        {
          model: Category,
          attributes: ["category_name"],
          required: false,
          where: {
            category_name: { [Op.iLike]: keyword }
          }
        }
      ]
    });

    res.json(products);
  } catch (err) {
    console.error("Lỗi tìm kiếm:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

