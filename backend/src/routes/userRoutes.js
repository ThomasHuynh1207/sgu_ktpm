import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js"; // sửa đúng cú pháp

const router = express.Router();

// PUBLIC (không cần token)
router.post("/login", loginUser);
router.post("/", createUser); // đăng ký

// PRIVATE – tất cả route dưới đây đều cần đăng nhập
router.use(protect); // từ đây trở xuống phải có token mới vào được

// Route lấy thông tin user hiện tại (QUAN TRỌNG NHẤT)
router.get("/me", (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// Chỉ admin mới được dùng các route này
router.get("/", admin, getAllUsers);          // danh sách tất cả user
router.delete("/:id", admin, deleteUser);     // xóa user

// User tự chỉnh sửa thông tin cá nhân thì không cần admin
router.get("/:id", getUserById);
router.put("/:id", updateUser);

export default router;