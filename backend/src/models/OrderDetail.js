import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Order from "./Order.js";
import Product from "./Product.js";

const OrderDetail = sequelize.define("OrderDetail", {
  detail_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_id: { type: DataTypes.INTEGER, references: { model: "orders", key: "order_id" } },
  product_id: { type: DataTypes.INTEGER, references: { model: "products", key: "product_id" } },
  quantity: { type: DataTypes.INTEGER },
  price: { type: DataTypes.DECIMAL(12, 2) },
}, {
  tableName: "order_details",
  timestamps: false,
});



export default OrderDetail;
