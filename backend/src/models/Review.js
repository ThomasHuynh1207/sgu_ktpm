import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Product from "./Product.js";

const Review = sequelize.define("Review", {
  review_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, references: { model: "users", key: "user_id" } },
  product_id: { type: DataTypes.INTEGER, references: { model: "products", key: "product_id" } },
  rating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
  comment: { type: DataTypes.TEXT },
  review_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: "reviews",
  timestamps: false,
});

Review.belongsTo(User, { foreignKey: "user_id" });
Review.belongsTo(Product, { foreignKey: "product_id" });

export default Review;
