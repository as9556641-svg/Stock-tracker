const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      default: null
    },
    stockName: {
      type: String,
      required: true,
      trim: true
    },
    stockSymbol: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },
    action: {
      type: String,
      enum: ["ADD", "UPDATE", "DELETE", "REFRESH_PRICE"],
      required: true
    },
    quantity: {
      type: Number,
      default: 0
    },
    averageCost: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      default: 0
    },
    amountChanged: {
      type: Number,
      default: 0
    },
    note: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
