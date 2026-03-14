// ============================================================
//  FILE: models/Project.js
//  ROLE: Blueprint for a Project
//  WHY THIS FILE EXISTS:
//    Our app allows users to manage projects for their clients.
//  WHAT IT DOES:
//    - Defines the Project fields (name, description, status)
//    - Links the project to the User who created it
//    - Links the project to the Client it belongs to
// ============================================================

const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a project name"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started", // When you create it, it's not started by default
    },
    // We link the project to a specific user.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // This refers to our User model
    },
    // We link the project to a specific client.
    client: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Client", // This refers to our Client model
    },
    deadline: {
      type: Date,
      required: [true, "Please add a deadline"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
