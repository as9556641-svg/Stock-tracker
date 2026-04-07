const Stock = require("../models/Stock");
const Transaction = require("../models/Transaction");
const { getQuoteFromAlphaVantage } = require("../services/marketService");

const recordTransaction = async ({
  userId,
  stockId = null,
  stockName,
  stockSymbol,
  action,
  quantity,
  averageCost,
  price,
  amountChanged = 0,
  note = ""
}) => {
  await Transaction.create({
    user: userId,
    stock: stockId,
    stockName,
    stockSymbol,
    action,
    quantity,
    averageCost,
    price,
    amountChanged,
    note
  });
};

const getStocks = async (req, res) => {
  try {
    const stocks = await Stock.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(stocks);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch portfolio stocks" });
  }
};

const addStock = async (req, res) => {
  try {
    const { name, symbol, quantity, price, averageCost } = req.body;

    if (!name || !symbol || !quantity || price === undefined || averageCost === undefined) {
      return res.status(400).json({
        message: "Name, symbol, quantity, price, and average cost are required"
      });
    }

    let currentPrice = Number(price);

    if (price === undefined || Number.isNaN(currentPrice)) {
      const quote = await getQuoteFromAlphaVantage(symbol.trim().toUpperCase());
      currentPrice = quote.price;
    }

    const newStock = await Stock.create({
      user: req.user.id,
      name: name.trim(),
      symbol: symbol.trim().toUpperCase(),
      quantity: Number(quantity),
      price: currentPrice,
      averageCost: Number(averageCost),
      priceUpdatedAt: new Date()
    });

    await recordTransaction({
      userId: req.user.id,
      stockId: newStock._id,
      stockName: newStock.name,
      stockSymbol: newStock.symbol,
      action: "ADD",
      quantity: newStock.quantity,
      averageCost: newStock.averageCost,
      price: newStock.price,
      amountChanged: newStock.quantity * newStock.averageCost,
      note: "Added stock to portfolio"
    });

    return res.status(201).json(newStock);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to add stock" });
  }
};

const updateStock = async (req, res) => {
  try {
    const { name, quantity, averageCost } = req.body;
    const stock = await Stock.findOne({ _id: req.params.id, user: req.user.id });

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    const previousInvestment = stock.quantity * stock.averageCost;

    if (name) {
      stock.name = name.trim();
    }

    if (quantity !== undefined) {
      stock.quantity = Number(quantity);
    }

    if (averageCost !== undefined) {
      stock.averageCost = Number(averageCost);
    }

    await stock.save();

    const currentInvestment = stock.quantity * stock.averageCost;

    await recordTransaction({
      userId: req.user.id,
      stockId: stock._id,
      stockName: stock.name,
      stockSymbol: stock.symbol,
      action: "UPDATE",
      quantity: stock.quantity,
      averageCost: stock.averageCost,
      price: stock.price,
      amountChanged: currentInvestment - previousInvestment,
      note: "Updated stock holding"
    });

    return res.status(200).json(stock);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update stock" });
  }
};

const refreshStockPrice = async (req, res) => {
  try {
    const stock = await Stock.findOne({ _id: req.params.id, user: req.user.id });

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    const quote = await getQuoteFromAlphaVantage(stock.symbol);
    stock.price = quote.price;
    stock.priceUpdatedAt = quote.priceUpdatedAt;
    await stock.save();

    await recordTransaction({
      userId: req.user.id,
      stockId: stock._id,
      stockName: stock.name,
      stockSymbol: stock.symbol,
      action: "REFRESH_PRICE",
      quantity: stock.quantity,
      averageCost: stock.averageCost,
      price: stock.price,
      amountChanged: 0,
      note: "Refreshed live stock price"
    });

    return res.status(200).json(stock);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to refresh stock price" });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch transaction history" });
  }
};

const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findOne({ _id: req.params.id, user: req.user.id });

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    await recordTransaction({
      userId: req.user.id,
      stockId: stock._id,
      stockName: stock.name,
      stockSymbol: stock.symbol,
      action: "DELETE",
      quantity: stock.quantity,
      averageCost: stock.averageCost,
      price: stock.price,
      amountChanged: -(stock.quantity * stock.averageCost),
      note: "Deleted stock from portfolio"
    });

    await stock.deleteOne();

    return res.status(200).json({ message: "Stock deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete stock" });
  }
};

module.exports = {
  getStocks,
  addStock,
  updateStock,
  refreshStockPrice,
  getTransactions,
  deleteStock
};
