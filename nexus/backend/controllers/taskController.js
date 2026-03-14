// ============================================================
//  FILE: controllers/taskController.js
//  ROLE: Logic for managing Tasks
//  WHY THIS FILE EXISTS:
//    Handles all database operations for Tasks.
//    A task MUST belong to a specific Project.
// ============================================================

const Task = require("../models/Task");
const Project = require("../models/Project");

// @desc    Get all tasks for the logged in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    // We populate the project so we can show the project name on the frontend
    const tasks = await Task.find({ user: req.user.id }).populate('project', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get all tasks for a specific project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = async (req, res) => {
  try {
    // 1. Verify the project exists and belongs to this user
    const project = await Project.findById(req.params.projectId);
    
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to view these tasks" });
    }

    // 2. Find tasks linked to this project
    const tasks = await Task.find({ project: req.params.projectId }).populate('project', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, projectId } = req.body;

    if (!title || !description || !projectId) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    // 1. Verify the project exists
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    
    // 2. Security Check
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to add a task to this project" });
    }

    // 3. Create Task
    const task = await Task.create({
      title,
      description,
      project: projectId,
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Update a task (e.g. mark as completed)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await task.deleteOne();
    res.json({ id: req.params.id, message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getTasks,
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
};
