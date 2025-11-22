import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Product from "./Product.js";

const Cart = sequelize.define("Cart", {
  cart_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, references: { model: "users", key: "user_id" } },
  product_id: { type: DataTypes.INTEGER, references: { model: "products", key: "product_id" } },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  added_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: "cart",
  timestamps: false,
});

Cart.belongsTo(User, { foreignKey: "user_id" });
Cart.belongsTo(Product, { foreignKey: "product_id" });

export default Cart;
