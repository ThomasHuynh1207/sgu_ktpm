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
sequelize.sync({ alter: true }).then(() => {
  console.log("✅ DB connected");
  app.listen(process.env.PORT || 5000, () =>
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
  );
}).catch(err => console.error("❌ Database error:", err));
