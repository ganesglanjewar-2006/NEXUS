const mongoose = require("mongoose");

// Transaction History Schema — tracks every buy/sell/update action
const transactionSchema = mongoose.Schema({
  action: {
    type: String,
    enum: ["BUY", "SELL", "UPDATE"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    default: "",
  },
});

const portfolioSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    userName: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: [true, "Please add a symbol (e.g., AAPL, BTC)"],
      uppercase: true,
    },
    name: {
      type: String, // Company or Coin name
    },
    quantity: {
      type: Number,
      required: [true, "Please add quantity"],
      default: 0,
    },
    averagePrice: {
      type: Number,
      required: [true, "Please add average purchase price"],
      default: 0,
    },
    assetType: {
      type: String,
      enum: ["stock", "crypto"],
      required: true,
    },
    // NEW: Transaction history array — stores every buy/sell action
    history: [
      {
        ...transactionSchema.obj,
        userName: { type: String }, // Track who did the transaction
      },
    ],
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
