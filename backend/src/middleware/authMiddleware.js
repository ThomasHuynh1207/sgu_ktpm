// backend/src/middleware/authMiddleware.js

import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Bảo vệ route – kiểm tra JWT
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "abc123");

      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });

      if (!req.user) {
        return res.status(401).json({ message: "Không tìm thấy người dùng" });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Token không hợp lệ" });
    }
  } else {
    return res.status(401).json({ message: "Không có token, truy cập bị từ chối" });
  }
};

// Chỉ cho admin dùng
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Chỉ admin mới có quyền truy cập" });
  }
};