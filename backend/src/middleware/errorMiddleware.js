export const errorHandler = (err, req, res, next) => {
  console.error("Lỗi:", err);
  res.status(500).json({ message: err.message || "Đã xảy ra lỗi server" });
};
