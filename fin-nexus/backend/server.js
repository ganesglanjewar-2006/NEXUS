const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// DEBUG: Log every request
app.use((req, res, next) => {
    console.log(`📥 [${req.method}] ${req.url} | MONGO_URI: ${!!process.env.MONGO_URI}`);
    next();
});

// --- DB CONNECTION MIDDLEWARE (serverless-safe) ---
app.use(async (req, res, next) => {
    // Skip DB connection for static file requests
    if (req.url.match(/\.(js|css|png|jpg|ico|svg|woff|woff2|ttf|eot|map)$/)) {
        return next();
    }
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

// --- SERVE FRONTEND ---
// Serve static files from the built frontend
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// SPA fallback - any non-API route serves index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("🔥 Global Error:", err.message);
    res.status(500).json({
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'production' ? 'Check Vercel logs' : err.message
    });
});

const PORT = process.env.PORT || 5002;

if (!process.env.VERCEL) {
    const server = app.listen(PORT, () => {
        console.log(`🚀 CapitalVue running on port ${PORT}`);
    });
    server.on('error', (err) => {
        console.error('❌ Server error:', err);
        process.exit(1);
    });
}

module.exports = app;
