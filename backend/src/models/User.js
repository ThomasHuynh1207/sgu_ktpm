import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("User", {
  user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  password: { type: DataTypes.TEXT, allowNull: false },
  email: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  full_name: { type: DataTypes.STRING(100) },
  phone: { type: DataTypes.STRING(15) },
  address: { type: DataTypes.STRING(255) },
  role: {
    type: DataTypes.ENUM("admin", "customer"),
    defaultValue: "customer",
  },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: "users",
  timestamps: false,
});

export default User;
