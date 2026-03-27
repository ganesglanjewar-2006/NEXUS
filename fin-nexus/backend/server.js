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

// --- DB CONNECTION MIDDLEWARE (serverless-safe) ---
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("❌ Failed to connect to DB:", err.message);
        return res.status(503).json({ message: "Database unavailable. Please try again." });
    }
});

// --- API ROUTES ---
app.use("/api/users", require("./routes/authRoutes"));
app.use("/api/portfolio", require("./routes/portfolioRoutes"));
app.use("/api/stocks", require("./routes/stockRoutes"));

// API Health Check
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "CapitalVue API is Running!",
        db_connected: true
    });
});

// --- REMOVED ALL STATIC FRONTEND SERVING LOGIC ---
// Vercel native static serving and rewrites in vercel.json will handle the React SPA.
// This prevents ENOENT errors in serverless functions that don't have the build files.

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("🔥 Global Error:", err.message);
    res.status(500).json({
        message: "Internal Server Error"
    });
});

const PORT = process.env.PORT || 5002;

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 CapitalVue API running on port ${PORT}`);
    });
}

module.exports = app;
