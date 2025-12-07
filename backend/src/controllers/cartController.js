import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Lấy giỏ hàng theo userId
export const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: Product,
    });
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy giỏ hàng", error: err.message });
  }
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;
    const cartItem = await Cart.create({ user_id, product_id, quantity });
    res.status(201).json(cartItem);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi thêm vào giỏ hàng", error: err.message });
  }
};

// Cập nhật sản phẩm trong giỏ hàng
export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cartItem = await Cart.findByPk(id);
    if (!cartItem) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    res.json({ message: "Cập nhật thành công", cartItem });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật giỏ hàng", error: err.message });
  }
};

// Xóa 1 sản phẩm khỏi giỏ hàng
export const removeFromCart = async (req, res) => {
  try {
    const item = await Cart.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
    await item.destroy();
    res.json({ message: "Đã xóa sản phẩm khỏi giỏ hàng" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm khỏi giỏ hàng", error: err.message });
  }
};

// 🟢 Xóa toàn bộ giỏ hàng theo userId
export const clearCart = async (req, res) => {
  try {
    // LẤY user_id TỪ TOKEN ĐÃ XÁC THỰC – KHÔNG CẦN PARAMS NỮA!
    const userId = req.user.user_id;

    const deleted = await Cart.destroy({
      where: { user_id: userId }
    });

    if (deleted === 0) {
      return res.json({ message: "Giỏ hàng đã trống" });
    }

    res.json({ message: "Đã xóa toàn bộ giỏ hàng thành công!" });
  } catch (err) {
    console.error("Lỗi clear cart:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

