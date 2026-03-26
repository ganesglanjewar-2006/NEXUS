const mongoose = require("mongoose");

// Cache the connection across serverless invocations
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        // Already connected — reuse the connection
        return cached.conn;
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI environment variable is not defined.");
    }

    if (!cached.promise) {
        console.log("🔗 Creating new MongoDB connection...");
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 10000,
        };
        cached.promise = mongoose.connect(process.env.MONGO_URI, opts);
    }

    try {
        cached.conn = await cached.promise;
        console.log(`✅ MongoDB Connected: ${cached.conn.connection.host}`);
    } catch (error) {
        cached.promise = null; // Allow retry on next invocation
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        throw error;
    }

    return cached.conn;
};

module.exports = connectDB;
