import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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



export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // ————————————————
    //  TẠO TOKEN JWT
    // ————————————————
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("TOKEN BACKEND ĐÃ TẠO =", token);
    // ————————————————
    //  TRẢ TOKEN + USER CHO FRONTEND
    // ————————————————
    res.json({
      message: "Login successful",
      token: token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login error" });
  }
};