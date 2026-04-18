const express = require("express");

const { getStockQuote } = require("../controllers/marketController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);
router.get("/quote/:symbol", getStockQuote);
router.get("/price/:symbol", getStockQuote);

module.exports = router;
