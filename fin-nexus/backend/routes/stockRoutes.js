const express = require("express");
const router = express.Router();
const { getStockHistory, getStockQuote } = require("../controllers/stockController");

// These routes are PUBLIC — no auth needed because it's just market data
// GET /api/stocks/AAPL       → 30-day price history for chart
// GET /api/stocks/AAPL/quote → Current price + change
router.get("/:symbol", getStockHistory);
router.get("/:symbol/quote", getStockQuote);

module.exports = router;
