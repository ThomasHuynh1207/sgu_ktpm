import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách thanh toán", error: err.message });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: "Không tìm thấy thanh toán" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy thanh toán", error: err.message });
  }
};

export const createPayment = async (req, res) => {
  try {
    const { order_id, payment_method, payment_status } = req.body;
    const payment = await Payment.create({ order_id, payment_method, payment_status });
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tạo thanh toán", error: err.message });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_method, amount, payment_status } = req.body;

    const payment = await Payment.findByPk(id);
    if (!payment) return res.status(404).json({ message: "Không tìm thấy thanh toán để cập nhật" });

    payment.payment_method = payment_method ?? payment.payment_method;
    payment.amount = amount ?? payment.amount;
    payment.payment_status = payment_status ?? payment.payment_status;

    await payment.save();

    res.json({ message: "Cập nhật thanh toán thành công", payment });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật thanh toán", error: err.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({ include: Order });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách thanh toán", error: err.message });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ message: "Không tìm thấy thanh toán để xóa" });
    }

    await payment.destroy();
    res.json({ message: "Xóa thanh toán thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa thanh toán", error: err.message });
  }
};