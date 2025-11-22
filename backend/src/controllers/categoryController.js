import Category from "../models/Category.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách danh mục", error: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tạo danh mục", error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Không tìm thấy danh mục" });
    await category.update(req.body);
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật danh mục", error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Không tìm thấy danh mục" });
    await category.destroy();
    res.json({ message: "Đã xóa danh mục" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa danh mục", error: err.message });
  }
};



// Lấy thông tin danh mục theo ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params; // lấy id từ URL

    const category = await Category.findById(id); // tìm theo _id trong MongoDB

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục." });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Lỗi khi lấy danh mục theo ID:", error);
    res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
};
