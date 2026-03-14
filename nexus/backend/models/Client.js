// ============================================================
//  FILE: models/Client.js
//  ROLE: Blueprint for a Client
//  WHY THIS FILE EXISTS:
//    Our app is a Client Management System. We need to store
//    information about our clients.
//  WHAT IT DOES:
//    - Defines the Client fields (name, email, phone, company)
//    - Links the client to the User who created it
// ============================================================

const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
    },
    phone: {
      type: String,
      required: [true, "Please add a phone number"],
    },
    company: {
      type: String,
      required: [true, "Please add a company name"],
    },
    // We link the client to a specific user. 
    // This way, User A can't see User B's clients.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // This refers to our User model
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Client", clientSchema);
