// ============================================================
//  FILE: models/User.js
//  ROLE: Blueprint for a User in the Database
//  WHY THIS FILE EXISTS:
//    MongoDB is a NoSQL database, meaning it doesn't force a
//    strict structure. Mongoose "Schemas" fix this by forcing
//    every user to have specific fields (name, email, password)
//    and ensuring they are the correct data type (String, Number).
//  WHAT IT DOES:
//    - Defines the User schema
//    - Hashes the password BEFORE saving to the DB automatically
//    - Adds a helper method to compare passwords during login
// ============================================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Used to encrypt passwords

// 1. Define the Blueprint (Schema)
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"], // Cannot be empty
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true, // No two users can have the same email
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6, // Passwords must be at least 6 characters
      select: false, // Security feature: Don't return the password when we query for user data
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt dates
  }
);

// 2. Pre-Save Hook (Encrypt Password before saving)
// "pre('save')" means this runs right before the user is saved to MongoDB
userSchema.pre("save", async function (next) {
  // If the password hasn't been changed (e.g. they only changed their name), skip this
  if (!this.isModified("password")) {
    next();
  }

  // Generate a 'salt' - random data added to the password before hashing it
  const salt = await bcrypt.genSalt(10);
  // Hash the password with the salt
  this.password = await bcrypt.hash(this.password, salt);
});

// 3. Helper Method (Compare Passwords)
// We use this when a user tries to log in. It compares the plain text password
// they typed with the encrypted password in the database.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 4. Export the Model
// We compile the schema into a "Model" which is a class we can use to query the DB
module.exports = mongoose.model("User", userSchema);
