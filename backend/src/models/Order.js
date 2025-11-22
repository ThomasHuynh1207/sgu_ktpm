import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Order = sequelize.define("Order", {
  order_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, references: { model: "users", key: "user_id" } },
  total_amount: { type: DataTypes.DECIMAL(10, 2) },
  order_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  status: {
    type: DataTypes.ENUM("Pending", "Processing", "Shipped", "Delivered", "Cancelled"),
    defaultValue: "Pending",
  },
  shipping_address: { type: DataTypes.STRING(255) },
}, {
  tableName: "orders",
  timestamps: false,
});

Order.belongsTo(User, { foreignKey: "user_id" });

export default Order;
