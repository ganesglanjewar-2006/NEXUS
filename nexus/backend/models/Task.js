// ============================================================
//  FILE: models/Task.js
//  ROLE: Blueprint for a Task
//  WHY THIS FILE EXISTS:
//    Our app allows users to break projects into smaller tasks.
//  WHAT IT DOES:
//    - Defines the Task fields (title, description, isCompleted)
//    - Links the task to the User who created it
//    - Links the task to the Project it belongs to
// ============================================================

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a task title"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    isCompleted: {
      type: Boolean,
      default: false, // Tasks start out as not completed
    },
    // We link the task to a specific user.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // This refers to our User model
    },
    // We link the task to a specific project.
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Project", // This refers to our Project model
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
