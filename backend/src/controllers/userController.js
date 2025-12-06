import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { Op } from 'sequelize';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng", error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy người dùng", error: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, password, email, full_name, phone, address, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword, email, full_name, phone, address, role });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tạo người dùng", error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    await user.update(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật người dùng", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    await user.destroy();
    res.json({ message: "Đã xóa người dùng thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa người dùng", error: err.message });
  }
};

// controllers/userController.js
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Vui lòng nhập tên đăng nhập và mật khẩu" });
    }

    // TÌM USER TRONG DB
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
    }

    // LẤY DỮ LIỆU THẬT (Sequelize hay trả về object có dataValues)
    const userData = user.dataValues || user.get({ plain: true });

    // KIỂM TRA MẬT KHẨU
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
    }

    // TẠO TOKEN
    const token = jwt.sign(
      { 
        user_id: userData.user_id, 
        username: userData.username, 
        role: userData.role 
      },
      process.env.JWT_SECRET || 'techstore2025secret',
      { expiresIn: '7d' }
    );

    // TRẢ VỀ TOKEN + USER – BẮT BUỘC PHẢI CÓ TOKEN!!!
    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        user_id: userData.user_id,
        username: userData.username,
        email: userData.email || '',
        role: userData.role || 'customer',
        full_name: userData.full_name || userData.username,
        phone: userData.phone || '',
        address: userData.address || ''
      }
    });

  } catch (error) {
    console.error("LỖI ĐĂNG NHẬP CHI TIẾT:", error);
    return res.status(500).json({ 
      message: "Lỗi server khi đăng nhập",
      error: error.message 
    });
  }
};