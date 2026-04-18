const { getQuoteFromAlphaVantage, normalizeStockSymbol } = require("../services/marketService");

const getStockQuote = async (req, res) => {
  try {
    const symbol = normalizeStockSymbol(req.params.symbol);

    const quote = await getQuoteFromAlphaVantage(symbol);
    return res.status(200).json(quote);
  } catch (error) {
    const statusCode = error.message === "Missing ALPHA_VANTAGE_API_KEY" ? 503 : 400;
    return res.status(statusCode).json({ message: error.message });
  }
};

const getStockPrice = async (req, res) => {
  try {
    const symbol = normalizeStockSymbol(req.params.symbol);
    const quote = await getQuoteFromAlphaVantage(symbol);

    return res.status(200).json({ price: quote.price });
  } catch (error) {
    const statusCode = error.message === "Missing ALPHA_VANTAGE_API_KEY" ? 503 : 400;
    return res.status(statusCode).json({ message: error.message });
  }
};

module.exports = {
  getStockQuote,
  getStockPrice
};
