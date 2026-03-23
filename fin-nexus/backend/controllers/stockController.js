const axios = require("axios");

// Free Alpha Vantage API Key (demo key for development)
// In production you would get your own key from https://www.alphavantage.co/support/#api-key
const ALPHA_VANTAGE_KEY = "demo";

// @desc    Get stock price history (daily)
// @route   GET /api/stocks/:symbol
// @access  Public (no auth needed — this is just market data)
const getStockHistory = async (req, res) => {
  const { symbol } = req.params;

  try {
    // BACKEND → EXTERNAL API: Fetch stock data from Alpha Vantage
    // We use the backend as a "proxy" so the API key stays on the server
    // and the frontend doesn't need to know about it
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}&outputsize=compact`
    );

    const timeSeries = response.data["Time Series (Daily)"];

    // If API returns an error or no data, use demo data
    if (!timeSeries) {
      // Generate realistic demo data for the last 30 days
      const demoData = generateDemoData(symbol);
      return res.status(200).json({
        symbol,
        source: "demo",
        message: "Using demo data. Get a free API key at alphavantage.co for real data.",
        history: demoData,
      });
    }

    // Convert Alpha Vantage format to a clean array
    // Alpha Vantage returns: { "2026-03-19": { "1. open": "195", "4. close": "198", ... } }
    // We convert to: [{ date: "2026-03-19", open: 195, close: 198, high: 200, low: 194, volume: 5000000 }]
    const history = Object.entries(timeSeries)
      .slice(0, 30) // Last 30 days
      .map(([date, values]) => ({
        date,
        open: parseFloat(values["1. open"]),
        high: parseFloat(values["2. high"]),
        low: parseFloat(values["3. low"]),
        close: parseFloat(values["4. close"]),
        volume: parseInt(values["5. volume"]),
      }))
      .reverse(); // Oldest first for the chart

    res.status(200).json({
      symbol,
      source: "alphavantage",
      history,
    });
  } catch (error) {
    console.error("Stock API error:", error.message);
    // Fallback to demo data if API fails
    const demoData = generateDemoData(symbol);
    res.status(200).json({
      symbol,
      source: "demo",
      message: "API unavailable. Using demo data.",
      history: demoData,
    });
  }
};

// @desc    Get stock quote (current price)
// @route   GET /api/stocks/:symbol/quote
// @access  Public
const getStockQuote = async (req, res) => {
  const { symbol } = req.params;

  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`
    );

    const quote = response.data["Global Quote"];

    if (!quote || !quote["05. price"]) {
      return res.status(200).json({
        symbol,
        source: "demo",
        price: getDemoPrice(symbol),
        change: (Math.random() * 6 - 3).toFixed(2),
        changePercent: (Math.random() * 4 - 2).toFixed(2) + "%",
      });
    }

    res.status(200).json({
      symbol,
      source: "alphavantage",
      price: parseFloat(quote["05. price"]).toFixed(2),
      change: parseFloat(quote["09. change"]).toFixed(2),
      changePercent: quote["10. change percent"],
    });
  } catch (error) {
    res.status(200).json({
      symbol,
      source: "demo",
      price: getDemoPrice(symbol),
      change: (Math.random() * 6 - 3).toFixed(2),
      changePercent: (Math.random() * 4 - 2).toFixed(2) + "%",
    });
  }
};

// Helper: Generate realistic demo stock data for 30 days
function generateDemoData(symbol) {
  const basePrice = getDemoPrice(symbol);
  const data = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const randomChange = (Math.random() - 0.48) * basePrice * 0.03;
    const open = basePrice + randomChange + (Math.random() - 0.5) * 5;
    const close = open + (Math.random() - 0.48) * 4;
    const high = Math.max(open, close) + Math.random() * 3;
    const low = Math.min(open, close) - Math.random() * 3;

    data.push({
      date: date.toISOString().split("T")[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(Math.random() * 80000000 + 20000000),
    });
  }
  return data;
}

// Helper: Get a realistic base price for common tickers
function getDemoPrice(symbol) {
  const prices = {
    AAPL: 195, GOOGL: 175, MSFT: 420, TSLA: 245, AMZN: 185,
    META: 505, NVDA: 880, NFLX: 620, JPM: 195, V: 280,
  };
  return prices[symbol.toUpperCase()] || 100 + Math.random() * 200;
}

module.exports = { getStockHistory, getStockQuote };
