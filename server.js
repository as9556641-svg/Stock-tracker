require("dotenv").config();

const cors = require("cors");
const express = require("express");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const marketRoutes = require("./src/routes/marketRoutes");
const stockRoutes = require("./src/routes/stockRoutes");
const { getStockPrice } = require("./src/controllers/marketController");

const app = express();
const PORT = process.env.PORT || 5000;
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
const allowedOrigins = (
  process.env.CLIENT_URL ||
  "https://stock-tracker-liard-sigma.vercel.app,http://localhost:5173"
)
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}

const corsOptions = {
  origin: (origin, callback) => {
    const isAllowedVercelPreview = typeof origin === "string" && origin.endsWith(".vercel.app");

    if (!origin || allowedOrigins.includes(origin) || isAllowedVercelPreview) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(express.json());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Express MongoDB auth API is running"
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok"
  });
});

app.get("/api/stock-price/:symbol", getStockPrice);

app.use("/api/auth", authRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/stock", marketRoutes);
app.use("/api/portfolio", stockRoutes);
app.use("/api/stocks", stockRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use((error, req, res, next) => {
  console.error("Unhandled error:", error.message);

  if (res.headersSent) {
    return next(error);
  }

  if (error.message?.includes("CORS")) {
    return res.status(403).json({
      success: false,
      message: error.message
    });
  }

  return res.status(500).json({
    success: false,
    message: error.message || "Internal server error"
  });
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

module.exports = app;
