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

export const loginUser = async (req, res) => {
 try {
 const { username, password } = req.body; 

    // 🌟🌟🌟 ĐÃ CẬP NHẬT: Thay thế User.sequelize.Op.or bằng Op.or sau khi import 🌟🌟🌟
 const user = await User.findOne({ 
        where: { 
            [Op.or]: [
                { username: username }, // Thử tìm theo Username
                { email: username }    // Thử tìm theo Email
            ]
        } 
    }); 
 
 if (!user) {
 // Nếu không tìm thấy user, trả về lỗi 404 (Lỗi này hiện đã được khắc phục)
 return res.status(404).json({ message: "User not found" });
 }

 // 2. So sánh mật khẩu đã băm (hashed password)
 const isPasswordMatch = await bcrypt.compare(password, user.password);

 if (!isPasswordMatch) {
 // Nếu mật khẩu không khớp, trả về lỗi 401
 return res.status(401).json({ message: "Invalid credentials" });
 }

 // 3. Nếu mọi thứ đúng, đăng nhập thành công
 res.status(200).json({ 
      message: "Login successful", 
      user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role
} 
});

  } catch (error) {
    // RẤT QUAN TRỌNG: Console log lỗi ra terminal server để debug
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
 }
};