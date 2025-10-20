import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME || "doan_db",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "123",
  {
    host: process.env.DB_HOST || "postgres_db",
    dialect: "postgres",
    port: 5432,
  }
);

sequelize.authenticate()
  .then(() => console.log("✅ Connected to PostgreSQL successfully"))
  .catch((err) => console.error("❌ Unable to connect to database:", err));


export default sequelize;

