const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- DB CONNECTION MIDDLEWARE ---
// Connects per-request (with caching) — required for serverless environments
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("❌ Failed to connect to DB:", err.message);
        return res.status(503).json({ message: "Database unavailable. Please try again." });
    }
});

// --- ROUTES ---
app.use("/api/users", require("./routes/authRoutes"));
app.use("/api/portfolio", require("./routes/portfolioRoutes"));
app.use("/api/stocks", require("./routes/stockRoutes"));  // Stock market data API

// ROOT ROUTE - API health check
app.get("/", (req, res) => {
    res.json({ message: "CapitalVue API is Running!", status: "ok" });
});

// Global Error Handler for Vercel troubleshooting
app.use((err, req, res, next) => {
    console.error("🔥 Global Error Caught:", err.message);
    res.status(500).json({
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'production' ? 'Refer to Vercel logs' : err.message
    });
});

const PORT = process.env.PORT || 5002;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    const server = app.listen(PORT, () => {
        console.log(`🚀 CapitalVue Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`❌ Port ${PORT} is already in use. Please try another port.`);
        } else {
            console.error('❌ Server error:', err);
        }
        process.exit(1);
    });
}

// Export for Vercel
module.exports = app;
