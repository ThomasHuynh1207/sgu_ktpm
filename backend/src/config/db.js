import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME || "computerstore",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "123456",
  {
    host: process.env.DB_HOST || "postgres_db",
    dialect: "postgres",
    port: 5432,
  }
);

export default sequelize;
