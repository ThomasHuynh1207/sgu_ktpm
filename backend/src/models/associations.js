// src/models/associations.js
import Order from "./Order.js";
import OrderDetail from "./OrderDetail.js";
import Product from "./Product.js";
import User from "./User.js";

// === ORDER ===
Order.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Order, { foreignKey: "user_id" });

Order.hasMany(OrderDetail, {
  foreignKey: "order_id",
  as: "order_details",
});

// === ORDER DETAIL ===
OrderDetail.belongsTo(Order, { foreignKey: "order_id" });
OrderDetail.belongsTo(Product, { foreignKey: "product_id" });

// === PRODUCT ===
Product.hasMany(OrderDetail, { foreignKey: "product_id" });

console.log("Associations đã được thiết lập thành công!");