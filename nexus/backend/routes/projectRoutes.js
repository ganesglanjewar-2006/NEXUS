// ============================================================
//  FILE: routes/projectRoutes.js
//  ROLE: URL Map for Project CRUD Operations
// ============================================================

const express = require("express");
const router = express.Router();
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const { protect } = require("../middleware/authMiddleware");

// Map URLs to functions, protected by JWT
router.route("/").get(protect, getProjects).post(protect, createProject);
router.route("/:id").put(protect, updateProject).delete(protect, deleteProject);

module.exports = router;
