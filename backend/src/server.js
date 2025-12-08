import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import sequelize from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors";
import "./models/associations.js";


dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:5173' 
}));

app.use(express.json());

// Routes
app.use("/api", routes);

app.use(errorHandler);

// Start
const startServer = async () => {
  try {
    await sequelize.sync({ });
    console.log("DB connected & synced successfully!");


    

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Database error:", err);
    process.exit(1);
  }
};

startServer();