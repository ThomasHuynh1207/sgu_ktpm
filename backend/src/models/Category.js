import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Category = sequelize.define("Category", {
  category_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  category_name: { type: DataTypes.STRING(100), allowNull: false },
  description: { type: DataTypes.TEXT },
}, {
  tableName: "categories",
  timestamps: false,
});

export default Category;
