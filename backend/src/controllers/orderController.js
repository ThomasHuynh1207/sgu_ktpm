import Order from "../models/Order.js";
import OrderDetail from "../models/OrderDetail.js";
import Product from "../models/Product.js";

// Tạo đơn hàng mới
export const createOrder = async (req, res) => {
  try {
    const { user_id, total_amount, shipping_address, items } = req.body;

    // Tạo đơn hàng
    const order = await Order.create({ user_id, total_amount, shipping_address });

    // Thêm chi tiết đơn hàng
    for (const item of items) {
      await OrderDetail.create({
        order_id: order.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      });
    }

    res.status(201).json({ message: "Tạo đơn hàng thành công", order });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tạo đơn hàng", error: err.message });
  }
};

// Lấy tất cả đơn hàng
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: { model: OrderDetail, include: Product },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng", error: err.message });
  }
};

// Lấy đơn hàng theo ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: { model: OrderDetail, include: Product },
    });

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy đơn hàng", error: err.message });
  }
};

// Cập nhật đơn hàng
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Order.update(req.body, { where: { order_id: id } });

    if (updated === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng cần cập nhật" });
    }

    const updatedOrder = await Order.findByPk(id);
    res.json({ message: "Cập nhật đơn hàng thành công", updatedOrder });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật đơn hàng", error: err.message });
  }
};

// Xóa đơn hàng
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Order.destroy({ where: { order_id: id } });

    if (deleted === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng cần xóa." });
    }

    res.status(200).json({ message: "Xóa đơn hàng thành công." });
  } catch (error) {
    console.error("Lỗi khi xóa đơn hàng:", error);
    res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
};
