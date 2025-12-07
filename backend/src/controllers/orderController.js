// backend/src/controllers/orderController.js
import Order from "../models/Order.js";
import OrderDetail from "../models/OrderDetail.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";

// TẠO ĐƠN HÀNG – ĐÃ HOÀN HẢO, CHỈ SỬA TRẢ VỀ ĐỂ FRONTEND DỄ DÙNG ID THẬT
export const createOrder = async (req, res) => {
  const t = await Order.sequelize.transaction();

  try {
    const userId = req.user.user_id;
    const {
      totalAmount,
      shippingAddress,
      paymentMethod = "COD",
      notes = "",
      phone,
      fullName,
      items,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống!" });
    }

    // Tạo đơn hàng
    const order = await Order.create(
      {
        user_id: userId,
        total_amount: totalAmount,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        status: "Pending",
        notes,
        phone,
        full_name: fullName || req.user.full_name || req.user.username,
      },
      { transaction: t }
    );

    // Tạo chi tiết + giảm stock
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product || product.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({
          message: product
            ? `Sản phẩm "${product.product_name}" chỉ còn ${product.stock} cái!`
            : `Không tìm thấy sản phẩm ID: ${item.productId}`,
        });
      }

      await OrderDetail.create(
        {
          order_id: order.order_id,
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
        },
        { transaction: t }
      );

      await product.decrement("stock", { by: item.quantity, transaction: t });
    }

    // Xóa giỏ hàng
    await Cart.destroy({ where: { user_id: userId }, transaction: t });
    await t.commit();

    // TRẢ VỀ ĐẦY ĐỦ ĐỂ FRONTEND DÙNG ID THẬT NGAY
    res.status(201).json({
      success: true,
      message: "Đặt hàng thành công!",
      order: {
        order_id: order.order_id,
        total_amount: order.total_amount,
        status: order.status,
        payment_method: order.payment_method,
        shipping_address: order.shipping_address,
        order_date: order.order_date,
        full_name: order.full_name,
        phone: order.phone,
      },
    });
  } catch (err) {
    await t.rollback();
    console.error("Lỗi tạo đơn hàng:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// CÁC HÀM KHÁC GIỮ NGUYÊN – CHỈ SỬA NHỎ ĐỂ TRẢ VỀ order_id THAY VÌ id
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.user_id },
      attributes: ['order_id', 'total_amount', 'status', 'payment_method', 'shipping_address', 'order_date', 'phone', 'full_name', 'notes'],
      include: [{
        model: OrderDetail,
        as: 'order_details',
        include: [{ model: Product, attributes: ['product_id', 'product_name', 'image', 'price'] }]
      }],
      order: [['order_date', 'DESC']]
    });

    res.json({
      success: true,
      count: orders.length,
      data: orders.map(o => ({
        ...o.toJSON(),
        id: o.order_id.toString(), // frontend dùng "id"
        order_id: o.order_id,
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    // Kiểm tra admin (đã có middleware rồi nhưng cứ để thêm cho chắc)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: "Chỉ admin mới có quyền xem tất cả đơn hàng" 
      });
    }

    const orders = await Order.findAll({
      attributes: [
        'order_id', 'user_id', 'total_amount', 'status', 'payment_method',
        'shipping_address', 'order_date', 'phone', 'full_name', 'notes'
      ],
      include: [
        {
          model: User,
          attributes: ['user_id', 'username', 'email', 'full_name']
        },
        {
          model: OrderDetail,
          as: 'order_details',
          attributes: ['product_id', 'quantity', 'price'],
          include: [
            {
              model: Product,
              attributes: ['product_id', 'product_name', 'image', 'price']
            }
          ]
        }
      ],
      order: [['order_date', 'DESC']]
    });

    // Format lại cho frontend dễ dùng
    const formattedOrders = orders.map(order => {
      const plain = order.toJSON();
      return {
        ...plain,
        id: plain.order_id.toString(),
        order_id: plain.order_id,
        items: plain.order_details?.map(detail => ({
          product: {
            product_id: detail.Product.product_id,
            product_name: detail.Product.product_name,
            price: detail.Product.price,
            image: detail.Product.image || 'https://via.placeholder.com/300',
            id: detail.Product.product_id.toString(),
            name: detail.Product.product_name,
          },
          quantity: detail.quantity,
        })) || []
      };
    });

    res.json({
      success: true,
      count: formattedOrders.length,
      data: formattedOrders
    });

  } catch (error) {
    console.error("LỖI LẤY TẤT CẢ ĐƠN HÀNG (ADMIN):", error.message);
    console.error(error.stack);
    res.status(500).json({ 
      success: false, 
      message: "Lỗi server khi tải đơn hàng admin",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['username', 'full_name', 'email'] },
        { model: OrderDetail, as: 'order_details', include: [Product] }
      ]
    });

    if (!order) return res.status(404).json({ success: false, message: "Không tìm thấy" });
    if (order.user_id !== req.user.user_id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Không có quyền" });
    }

    res.json({
      success: true,
      data: {
        ...order.toJSON(),
        id: order.order_id.toString(), // frontend dùng id
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!valid.includes(status)) return res.status(400).json({ message: "Trạng thái không hợp lệ" });

    const [updated] = await Order.update({ status }, { where: { order_id: req.params.id } });
    if (!updated) return res.status(404).json({ message: "Không tìm thấy đơn" });

    const order = await Order.findByPk(req.params.id);
    res.json({ success: true, message: "Cập nhật thành công", order });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteOrder = async (req, res) => {
  const t = await Order.sequelize.transaction();
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      await t.rollback();
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    await OrderDetail.destroy({ where: { order_id: req.params.id }, transaction: t });
    await Order.destroy({ where: { order_id: req.params.id }, transaction: t });
    await t.commit();

    res.json({ success: true, message: "Xóa đơn hàng thành công" });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: "Lỗi server" });
  }
};