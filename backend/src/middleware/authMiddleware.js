import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Không có token, truy cập bị từ chối" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET );

    // ĐÃ SỬA: dùng decoded.user_id thay vì decoded.id
    const user = await User.findByPk(decoded.user_id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(401).json({ message: "Không tìm thấy người dùng" });
    }

    req.user = user.dataValues;
    next();
  } catch (error) {
    console.error("Lỗi verify token:", error.message);
    return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Chỉ admin mới có quyền truy cập tài nguyên này"
    });
  }
};