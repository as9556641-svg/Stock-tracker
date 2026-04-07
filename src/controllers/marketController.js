const { getQuoteFromAlphaVantage } = require("../services/marketService");

const getStockQuote = async (req, res) => {
  try {
    const symbol = req.params.symbol?.trim().toUpperCase();

    if (!symbol) {
      return res.status(400).json({ message: "Stock symbol is required" });
    }

    const quote = await getQuoteFromAlphaVantage(symbol);
    return res.status(200).json(quote);
  } catch (error) {
    const statusCode = error.message === "Missing ALPHA_VANTAGE_API_KEY" ? 503 : 400;
    return res.status(statusCode).json({ message: error.message });
  }
};

module.exports = {
  getStockQuote
};
