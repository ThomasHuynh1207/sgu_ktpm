import Category from "../models/Category.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ["category_name"],
      order: [["category_name", "ASC"]],
    });
    // QUAN TRỌNG NHẤT: TRẢ VỀ MẢNG STRING!
    res.json(categories.map(c => c.category_name));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi lấy danh mục" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const [cat, created] = await Category.findOrCreate({
      where: { category_name: name.trim() },
      defaults: { category_name: name.trim() }
    });
    res.status(201).json({ name: cat.category_name });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    const { id } = req.params;

    const category = await Category.findByPk(id); // ← SỬA DÒNG NÀY: findByPk THAY VÌ findById!!!

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục." });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Lỗi khi lấy danh mục theo ID:", error);
    res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
};