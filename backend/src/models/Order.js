import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";



const Order = sequelize.define("Order", {
  order_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, references: { model: "users", key: "user_id" } },
  full_name: {type: DataTypes.STRING, allowNull: false,},
  phone: { type: DataTypes.STRING(20), allowNull: false,},
  total_amount: { type: DataTypes.DECIMAL(12, 2) },
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



export default Order;
