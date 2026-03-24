const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        
        console.log("🔗 Attempting to connect to MongoDB (checking whitelist/credentials)...");
        console.log("📝 URI Length:", process.env.MONGO_URI.length);

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000, // 10 seconds timeout for serverless
        });
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error Details: ${error.message}`);
        if (error.message.includes('IP address')) {
            console.error("⚠️ ACTION REQUIRED: Your MongoDB IP Whitelist is likely blocking Vercel. Set it to 0.0.0.0/0 in Atlas.");
        }
        throw error;
    }
};

module.exports = connectDB;
