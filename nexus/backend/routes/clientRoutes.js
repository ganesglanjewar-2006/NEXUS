// ============================================================
//  FILE: routes/clientRoutes.js
//  ROLE: URL Map for Client CRUD Operations
//  WHY THIS FILE EXISTS:
//    Connects the Client Controller logic to actual URL endpoints
//    AND uses authMiddleware to protect them.
// ============================================================

const express = require("express");
const router = express.Router();
const {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} = require("../controllers/clientController");

// Import the security middleware
const { protect } = require("../middleware/authMiddleware");

// router.route is a shortcut when the URL is the exact same.
// For "/", if it's a GET request -> run getClients
// For "/", if it's a POST request -> run createClient
// Notice we put 'protect' BEFORE the controller function. This forces
// the request to pass the security check before it can get or create data.
router.route("/").get(protect, getClients).post(protect, createClient);

// For "/:id" (like /api/clients/123)
// If PUT -> updateClient, if DELETE -> deleteClient
router.route("/:id").put(protect, updateClient).delete(protect, deleteClient);

module.exports = router;
