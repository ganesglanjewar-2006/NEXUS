// ============================================================
//  FILE: controllers/projectController.js
//  ROLE: Logic for managing Projects
//  WHY THIS FILE EXISTS:
//    Handles all database operations for Projects (Create, Read, Update, Delete).
//    It ensures a project is always tied to a specific Client and User.
// ============================================================

const Project = require("../models/Project");
const Client = require("../models/Client"); // We need this to verify the client exists

// @desc    Get all projects for the logged-in user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    // We can use .populate("client", "name email") to automatically fetch 
    // the client's name and email instead of just showing their ID!
    const projects = await Project.find({ user: req.user.id }).populate("client", "name company");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { name, description, status, clientId, deadline } = req.body;

    if (!name || !description || !clientId || !deadline) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    // 1. Verify the client exists and belongs to this user
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    if (client.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to add a project to this client" });
    }

    // 2. Create the project
    const project = await Project.create({
      name,
      description,
      status: status || "Not Started",
      client: clientId,
      user: req.user.id,
      deadline
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });
    
    // Security check: Only the creator can update it
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    // Security check
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await project.deleteOne();
    res.json({ id: req.params.id, message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};
