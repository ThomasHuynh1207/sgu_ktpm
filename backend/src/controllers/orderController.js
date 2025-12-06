// Tạo đơn hàng mới – ĐÃ SỬA HOÀN CHỈNH 100% (không còn lỗi đỏ)
export const createOrder = async (req, res) => {
  const t = await Order.sequelize.transaction();

  try {
    const userId = req.user.id; // từ middleware auth
    const {
      totalAmount,
      shippingAddress,
      paymentMethod = "COD",
      notes = "",
      phone,
      fullName,
      items, // [{ productId, quantity, price }]
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống!" });
    }

    // 1. Tạo đơn hàng chính
    const order = await Order.create(
      {
        user_id: userId,
        total_amount: totalAmount,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        status: "Pending",
        notes,
        phone,
        full_name: fullName || req.user.username,
      },
      { transaction: t }
    );

    // 2. Tạo chi tiết đơn hàng + giảm tồn kho
    for (const item of items) {
      const product = await Product.findByPk(item.productId);

      if (!product) {
        await t.rollback();
        return res.status(404).json({ message: `Không tìm thấy sản phẩm ID: ${item.productId}` });
      }

      if (product.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({
          message: `Sản phẩm "${product.product_name}" chỉ còn ${product.stock} cái!`,
        });
      }

      // Tạo chi tiết đơn hàng
      await OrderDetail.create(
        {
          order_id: order.order_id,
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
        },
        { transaction: t }
      );

      // Giảm tồn kho
      await product.decrement("stock", { by: item.quantity, transaction: t });
    }

    // 3. Xóa giỏ hàng của user
    await Cart.destroy({
      where: { user_id: userId },
      transaction: t,
    });

    // Commit transaction
    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Đặt hàng thành công!",
      orderId: order.order_id,
      total: totalAmount,
    });
  } catch (err) {
    await t.rollback();
    console.error("Lỗi tạo đơn hàng:", err);
    return res
      .status(500)
      .json({ message: "Lỗi server khi tạo đơn hàng", error: err.message });
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

    // Xóa chi tiết đơn hàng trước
    await OrderDetail.destroy({
      where: { order_id: req.params.id },
      transaction: t
    });

    // Xóa đơn hàng
    await Order.destroy({
      where: { order_id: req.params.id },
      transaction: t
    });

    await t.commit();
    res.json({ message: "Xóa đơn hàng thành công" });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi xóa đơn hàng" });
  }
};



// Lấy tất cả đơn hàng – DÀNH CHO ADMIN
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      attributes: [
        'order_id',
        'user_id',
        'total_amount',
        'status',
        'payment_method',
        'shipping_address',
        'order_date',
        'phone',
        'full_name',
        'notes'
      ],
      include: [
        {
          model: User,
          as: 'user', // nếu mày có đặt alias trong model thì để đúng, không thì bỏ as
          attributes: ['user_id', 'username', 'email', 'full_name', 'phone'],
        },
        {
          model: OrderDetail,
          as: 'order_details', // hoặc bỏ as nếu không dùng
          include: [
            {
              model: Product,
              attributes: ['product_id', 'product_name', 'price', 'image'],
            }
          ]
        }
      ],
      order: [['order_date', 'DESC']], // mới nhất lên đầu
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách đơn hàng:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách đơn hàng",
      error: error.message
    });
  }
};

// Lấy tất cả đơn hàng của người dùng đang đăng nhập
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id; // từ middleware protect

    const orders = await Order.findAll({
      where: { user_id: userId },
      attributes: [
        'order_id',
        'total_amount',
        'status',
        'payment_method',
        'shipping_address',
        'order_date',
        'phone',
        'full_name',
        'notes'
      ],
      include: [
        {
          model: OrderDetail,
          as: 'order_details', // nếu có hoặc không có as đều được nếu đã define đúng
          attributes: ['quantity', 'price'],
          include: [
            {
              model: Product,
              attributes: ['product_id', 'product_name', 'image', 'price']
            }
          ]
        }
      ],
      order: [['order_date', 'DESC']] // mới nhất lên đầu
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });

  } catch (error) {
    console.error("Lỗi lấy đơn hàng của tôi:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách đơn hàng",
      error: error.message
    });
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
    res.json({ message: "Cập nhật thành công", order });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy chi tiết đơn hàng theo ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      attributes: [
        'order_id',
        'user_id',
        'total_amount',
        'status',
        'payment_method',
        'shipping_address',
        'order_date',
        'phone',
        'full_name',
        'notes'
      ],
      include: [
        {
          model: User,
          as: 'user', // nếu có alias trong model, không thì bỏ as
          attributes: ['user_id', 'username', 'full_name', 'email', 'phone']
        },
        {
          model: OrderDetail,
          as: 'order_details', // nếu có alias, không thì bỏ
          include: [
            {
              model: Product,
              attributes: ['product_id', 'product_name', 'price', 'image']
            }
          ]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng"
      });
    }

    // Kiểm tra quyền truy cập: chỉ user liên quan hoặc admin mới xem được
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền truy cập đơn hàng này"
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error("Lỗi lấy chi tiết đơn hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy chi tiết đơn hàng",
      error: error.message
    });
  }
};