// ============================================================
//  FILE: config/db.js
//  ROLE: Database Connection Module
//  WHY THIS FILE EXISTS:
//    We separate the database connection logic into its own file
//    so that server.js stays clean and we can reuse or change
//    the DB connection in one place without touching anything else.
//  WHAT IT DOES:
//    - Reads the MONGO_URI from our .env file
//    - Uses Mongoose (an ODM library) to connect to MongoDB Atlas
//    - Logs success or failure to the console
// ============================================================

const mongoose = require("mongoose"); // Mongoose is the library that lets us talk to MongoDB

const connectDB = async () => {
  try {
    // mongoose.connect() opens a connection to the MongoDB database
    // process.env.MONGO_URI reads the connection string from our .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If connection is successful, log the host name so we know which DB we're on
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log the error message and shut down the server
    // process.exit(1) means "exit with an error code" — this stops the server
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Export this function so server.js can import and call it
module.exports = connectDB;
