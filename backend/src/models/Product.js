import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Category from "./Category.js";

const Product = sequelize.define("Product", {
  product_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  category_id: { type: DataTypes.INTEGER, references: { model: "categories", key: "category_id" } },
  product_name: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  image: { type: DataTypes.STRING(255) },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: "products",
  timestamps: false,
});

Product.belongsTo(Category, { foreignKey: "category_id" });

export default Product;
