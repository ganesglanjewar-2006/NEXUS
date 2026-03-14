// ============================================================
//  FILE: routes/taskRoutes.js
//  ROLE: URL Map for Task CRUD Operations
// ============================================================

const express = require("express");
const router = express.Router();
const {
  getTasks,
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");

// Map URLs to functions, protected by JWT
router.route("/").get(protect, getTasks).post(protect, createTask);
router.route("/:id").put(protect, updateTask).delete(protect, deleteTask);

// Notice this is different! We need to get tasks BY PROJECT, not all tasks ever created.
router.route("/project/:projectId").get(protect, getTasksByProject);

module.exports = router;
