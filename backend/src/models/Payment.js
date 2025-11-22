import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Order from "./Order.js";

const Payment = sequelize.define("Payment", {
  payment_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_id: { type: DataTypes.INTEGER, references: { model: "orders", key: "order_id" } },
  payment_method: {
    type: DataTypes.ENUM("COD", "CreditCard", "BankTransfer"),
    defaultValue: "COD",
  },
  payment_status: {
    type: DataTypes.ENUM("Pending", "Completed", "Failed"),
    defaultValue: "Pending",
  },
  payment_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: "payments",
  timestamps: false,
});

Payment.belongsTo(Order, { foreignKey: "order_id" });

export default Payment;
