require("dotenv").config();

const cors = require("cors");
const express = require("express");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const marketRoutes = require("./src/routes/marketRoutes");
const stockRoutes = require("./src/routes/stockRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Express MongoDB auth API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/stocks", stockRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
