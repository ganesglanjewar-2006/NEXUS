// ============================================================
//  FILE: controllers/authController.js
//  ROLE: Logic for User Registration and Login
//  WHY THIS FILE EXISTS:
//    We don't put giant blocks of code directly in our routes file.
//    Instead, the route file just says "When someone goes to /login,
//    run the loginUser function from authController". This keeps code clean.
//  WHAT IT DOES:
//    - registerUser: Creates a new user, hashes password (via User model), sends back a JWT token.
//    - loginUser: Checks email & password, if correct -> sends back a JWT token.
//    - generateToken: A helper function that creates the JSON Web Token.
// ============================================================

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// --- Helper Function to Generate a JWT Token ---
const generateToken = (id) => {
  // jwt.sign takes 3 things: 
  // 1. the payload (data to store in the token, usually the user's ID)
  // 2. the secret key (from .env) used to sign it
  // 3. options (like when it expires)
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token is valid for 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (Anyone can register)
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validation: Did they provide all fields?
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    // 2. Check if user already exists in MongoDB
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with that email" });
    }

    // 3. Create the user
    // Note: We don't hash the password here because our User.js model has a 
    // pre-save hook that will hash it automatically!
    const user = await User.create({
      name,
      email,
      password,
    });

    // 4. Send back a success response with the new token
    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id), // The magic key for future requests
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Authenticate/Login a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // 2. Find the user by email
    // .select("+password") is needed because in our User.js model, we set password to { select: false }.
    // This tells Mongoose "I know password is hidden, but I specifically need it right now for login".
    const user = await User.findOne({ email }).select("+password");

    // 3. Check if user exists AND password matches
    // user.matchPassword is the helper function we wrote in models/User.js!
    if (user && (await user.matchPassword(password))) {
      // Login successful! Send back their data and a new token.
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
