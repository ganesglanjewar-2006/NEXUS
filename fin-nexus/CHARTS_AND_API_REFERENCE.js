// ============================================================
//  FILE: CHARTS_AND_API_REFERENCE.js
//  PURPOSE: Reference guide for all charts, APIs, and data
//  libraries used in the CapitalVue project. Explains WHAT
//  we use, WHY we chose it, and the exact code lines.
//  This file is NOT executed — it's for learning only.
// ============================================================


// ════════════════════════════════════════════════════════════
//  SECTION 1: CHART LIBRARY — RECHARTS
// ════════════════════════════════════════════════════════════
//
//  WHAT: Recharts (https://recharts.org)
//  WHY:  - Built specifically for React (works with JSX)
//        - Lightweight (~150KB vs Chart.js ~200KB)
//        - Declarative — you write <LineChart> like HTML
//        - Responsive out of the box
//        - Free and open-source
//
//  ALTERNATIVES CONSIDERED:
//  - Chart.js → Good but needs a React wrapper (react-chartjs-2), extra setup
//  - D3.js → Very powerful but extremely complex for beginners
//  - ApexCharts → Also good but larger bundle size
//
//  INSTALLED VIA:
//  cd frontend && npm install recharts
//
//  FILE: frontend/src/components/StockChart.jsx
//
//  IMPORTANT RECHARTS COMPONENTS USED:

// 1. <ResponsiveContainer> — Makes the chart automatically resize
//    FILE: StockChart.jsx — wraps the entire chart
import { ResponsiveContainer } from 'recharts';
// <ResponsiveContainer width="100%" height={300}>
// REASON: Without this, the chart has a fixed size and won't adapt to screen size

// 2. <AreaChart> — The main chart type (line chart with gradient fill)
//    FILE: StockChart.jsx
import { AreaChart } from 'recharts';
// <AreaChart data={chartData}>
// REASON: AreaChart looks more premium than LineChart because of the gradient fill
//         The `data` prop receives an array like:
//         [{ date: "2026-03-01", close: 195.50, volume: 50000000 }, ...]

// 3. <Area> — The actual line + gradient fill on the chart
//    FILE: StockChart.jsx
import { Area } from 'recharts';
// <Area type="monotone" dataKey="close" stroke="#22c55e" fill="url(#gradient)" />
// REASON: `dataKey="close"` tells Recharts which field from the data array to plot
//         `type="monotone"` makes the line smooth instead of jagged
//         `stroke` = line color, `fill` = area below the line (uses SVG gradient)

// 4. <XAxis> — The horizontal axis (dates)
//    FILE: StockChart.jsx
import { XAxis } from 'recharts';
// <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
// REASON: `dataKey="date"` tells it which data field to show on the X axis
//         `tickFormatter` converts "2026-03-19" to "Mar 19" for readability

// 5. <YAxis> — The vertical axis (prices)
//    FILE: StockChart.jsx
import { YAxis } from 'recharts';
// <YAxis domain={['auto', 'auto']} tickFormatter={(val) => `$${val}`} />
// REASON: `domain=['auto', 'auto']` automatically calculates min/max from data
//         `tickFormatter` adds "$" prefix to each tick value

// 6. <Tooltip> — Popup that shows data when you hover over the chart
//    FILE: StockChart.jsx
import { Tooltip } from 'recharts';
// <Tooltip content={<CustomTooltip />} />
// REASON: We use a custom tooltip component to match our dark theme design

// 7. <CartesianGrid> — The grid lines behind the chart
//    FILE: StockChart.jsx
import { CartesianGrid } from 'recharts';
// <CartesianGrid strokeDasharray="3 3" stroke="rgba(71, 85, 105, 0.3)" />
// REASON: `strokeDasharray="3 3"` makes dashed lines (3px dash, 3px gap)

// 8. SVG <linearGradient> — The gradient fill below the chart line
//    FILE: StockChart.jsx
// <defs>
//   <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
//     <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
//     <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
//   </linearGradient>
// </defs>
// REASON: Creates a fade-down effect: green at top → transparent at bottom
//         This is what gives the chart its "premium" look


// ════════════════════════════════════════════════════════════
//  SECTION 2: STOCK DATA API — ALPHA VANTAGE
// ════════════════════════════════════════════════════════════
//
//  WHAT: Alpha Vantage (https://www.alphavantage.co)
//  WHY:  - FREE tier available (no credit card needed)
//        - Provides real stock data (daily, weekly, monthly)
//        - Supports symbols like AAPL, GOOGL, TSLA, etc.
//        - Returns JSON format (easy for JavaScript)
//        - 25 requests/day on free tier (good for development)
//
//  ALTERNATIVES CONSIDERED:
//  - Yahoo Finance API → Was free, now requires paid service
//  - IEX Cloud → Good but free tier is very limited
//  - Polygon.io → 5 free API calls/minute, more complex
//  - Finnhub → Good free tier but less historical data
//
//  GET YOUR OWN FREE KEY:
//  https://www.alphavantage.co/support/#api-key
//  Then update: backend/controllers/stockController.js → ALPHA_VANTAGE_KEY
//

// ═══════════════════════════════════════════════════════════
//  SECTION 3: ALL API ENDPOINTS IN THE PROJECT
// ═══════════════════════════════════════════════════════════

// ┌──────────────────────────────────────────────────────────────────────────────┐
// │ METHOD │ URL                         │ AUTH  │ CONTROLLER FILE              │
// ├──────────────────────────────────────────────────────────────────────────────┤
// │ POST   │ /api/users                  │ No    │ authController.registerUser   │
// │ POST   │ /api/users/login            │ No    │ authController.loginUser      │
// │ GET    │ /api/portfolio              │ JWT   │ portfolioController.getPortfolio│
// │ GET    │ /api/portfolio/:id          │ JWT   │ portfolioController.getAssetDetails│
// │ POST   │ /api/portfolio              │ JWT   │ portfolioController.addAsset  │
// │ PUT    │ /api/portfolio/:id          │ JWT   │ portfolioController.updateAsset│
// │ DELETE │ /api/portfolio/:id          │ JWT   │ portfolioController.deleteAsset│
// │ GET    │ /api/stocks/:symbol         │ No    │ stockController.getStockHistory│
// │ GET    │ /api/stocks/:symbol/quote   │ No    │ stockController.getStockQuote │
// └──────────────────────────────────────────────────────────────────────────────┘
//
// AUTH COLUMN:
// - "No" = Anyone can call this (public endpoint)
// - "JWT" = Must send Authorization header with Bearer token
//
// WHERE REGISTERED:
// FILE: backend/server.js — Lines 20-23
// app.use("/api/users", require("./routes/authRoutes"));
// app.use("/api/portfolio", require("./routes/portfolioRoutes"));
// app.use("/api/stocks", require("./routes/stockRoutes"));


// ════════════════════════════════════════════════════════════
//  SECTION 4: HOW THE STOCK API PROXY WORKS (Step by Step)
// ════════════════════════════════════════════════════════════
//
//  WHY A PROXY?
//  → We DON'T call Alpha Vantage directly from React because:
//    1. The API key would be visible in the browser (security risk)
//    2. Alpha Vantage blocks browser requests (CORS)
//    3. We can add caching/fallback on the server
//
//  FLOW:
//
//  Step 1: React asks our backend for stock data
//  FILE: frontend/src/components/StockChart.jsx — Line 42
//  const response = await axios.get(`http://localhost:5001/api/stocks/${symbol}`);
//  // e.g. GET http://localhost:5001/api/stocks/AAPL
//
//  Step 2: Express routes it to the stock controller
//  FILE: backend/routes/stockRoutes.js — Line 8
//  router.get("/:symbol", getStockHistory);
//
//  Step 3: The controller calls Alpha Vantage's API
//  FILE: backend/controllers/stockController.js — Lines 17-19
//  const response = await axios.get(
//    `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`
//  );
//
//  Step 4: Alpha Vantage returns raw data like:
//  {
//    "Time Series (Daily)": {
//      "2026-03-19": {
//        "1. open": "195.45",
//        "2. high": "198.30",
//        "3. low": "194.10",
//        "4. close": "197.25",
//        "5. volume": "58234000"
//      },
//      ...
//    }
//  }
//
//  Step 5: We convert it to a clean format:
//  FILE: backend/controllers/stockController.js — Lines 41-50
//  const history = Object.entries(timeSeries).map(([date, values]) => ({
//    date,
//    open: parseFloat(values["1. open"]),
//    close: parseFloat(values["4. close"]),
//    high: parseFloat(values["2. high"]),
//    low: parseFloat(values["3. low"]),
//    volume: parseInt(values["5. volume"]),
//  }));
//
//  Step 6: If API fails or is rate-limited, we use demo data
//  FILE: backend/controllers/stockController.js — Line 27
//  const demoData = generateDemoData(symbol);
//  // Generates realistic random stock prices for 30 days
//
//  Step 7: React receives the clean array and renders the chart
//  FILE: frontend/src/components/StockChart.jsx — Line 43
//  setChartData(response.data.history);
//  // Recharts <AreaChart data={chartData}> renders it automatically


// ════════════════════════════════════════════════════════════
//  SECTION 5: TRANSACTION HISTORY — HOW IT WORKS
// ════════════════════════════════════════════════════════════
//
//  WHAT: Every BUY/SELL/UPDATE action is recorded in the portfolio document
//  WHY:  So users can see WHEN they bought, at WHAT PRICE, and HOW MANY
//
//  WHERE STORED: MongoDB → inside each Portfolio document as a "history" array
//
//  FILE: backend/models/Portfolio.js — transactionSchema
//  Each history entry has:
//  {
//    action: "BUY",            // BUY, SELL, or UPDATE
//    quantity: 10,             // How many shares
//    price: 195.50,            // At what price
//    date: "2026-03-19T12:30", // When it happened (auto-set)
//    notes: "Initial purchase" // Optional note
//  }
//
//  WHEN IS HISTORY CREATED?
//
//  1. When you ADD a new stock (automatically):
//  FILE: backend/controllers/portfolioController.js — Lines 55-61
//  history: [{
//    action: "BUY",
//    quantity: Number(quantity),
//    price: Number(averagePrice),
//    date: new Date(),
//    notes: "Initial purchase",
//  }]
//
//  2. When you UPDATE an existing stock (manually):
//  FILE: backend/controllers/portfolioController.js — Lines 87-93
//  asset.history.push({
//    action: action || "UPDATE",
//    quantity: Number(quantity),
//    price: Number(averagePrice),
//    date: new Date(),
//    notes: notes || "",
//  });
//
//  WHERE IS HISTORY SHOWN?
//  FILE: frontend/src/components/AssetDetail.jsx — Lines 230-290
//  Renders a Material UI Table with columns: Date, Action, Qty, Price, Total, Notes
//  BUY actions = green chip, SELL actions = red chip


// ════════════════════════════════════════════════════════════
//  SECTION 6: COMPLETE DATA FLOW FOR CHARTS
// ════════════════════════════════════════════════════════════
//
//  User opens Dashboard → sees AAPL card → clicks it
//    → React Router loads AssetDetail.jsx with id from URL
//      → useEffect fetches asset details from backend
//        → GET /api/portfolio/:id (with JWT token)
//        → Response includes: symbol, quantity, price, createdAt, history[]
//
//  AssetDetail renders <StockChart symbol="AAPL" />
//    → StockChart useEffect triggers
//      → axios.get('http://localhost:5001/api/stocks/AAPL')
//        → Express calls Alpha Vantage API
//        → Converts response OR generates demo data
//        → Returns: { symbol: "AAPL", source: "demo", history: [...] }
//      → setChartData(response.data.history)
//      → Recharts <AreaChart data={chartData}> renders the chart
//        → <Area dataKey="close"> draws the price line
//        → <linearGradient> fills the area below with green fade
//        → <XAxis dataKey="date"> shows dates on bottom
//        → <YAxis> shows prices on left
//        → <Tooltip> shows price on hover
//
// ════════════════════════════════════════════════════════════
