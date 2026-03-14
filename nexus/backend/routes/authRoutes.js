// ============================================================
//  FILE: routes/authRoutes.js
//  ROLE: Wires up the URLs to the Controller functions
//  WHY THIS FILE EXISTS:
//    When the frontend sends a POST request to /api/auth/register,
//    Express looks here to know WHICH function in the controller to run.
// ============================================================

const express = require("express");
const router = express.Router();

// Import the logic functions from our controller
const { registerUser, loginUser } = require("../controllers/authController");

// When someone POSTs to /register, run registerUser()
router.post("/register", registerUser);

// When someone POSTs to /login, run loginUser()
router.post("/login", loginUser);

module.exports = router;
