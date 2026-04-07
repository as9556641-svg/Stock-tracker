const express = require("express");

const {
  getStocks,
  addStock,
  updateStock,
  refreshStockPrice,
  getTransactions,
  deleteStock
} = require("../controllers/stockController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

router.get("/transactions", getTransactions);
router.get("/", getStocks);
router.post("/", addStock);
router.put("/:id", updateStock);
router.post("/:id/refresh-price", refreshStockPrice);
router.delete("/:id", deleteStock);

module.exports = router;
