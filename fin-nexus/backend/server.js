const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- ROUTES ---
app.use("/api/users", require("./routes/authRoutes"));
app.use("/api/portfolio", require("./routes/portfolioRoutes"));
app.use("/api/stocks", require("./routes/stockRoutes"));  // Stock market data API

// --- PRODUCTION SETUP ---
// Serve the compiled frontend in production mode
if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    // Any route that is not an API route should serve the index.html
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
    });
} else {
    // ROOT ROUTE for Development
    app.get("/", (req, res) => {
        res.json({ message: "CapitalVue API Running in Development mode" });
    });
}

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
