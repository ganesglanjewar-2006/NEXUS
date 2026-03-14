// ============================================================
//  FILE: middleware/authMiddleware.js
//  ROLE: The "Bouncer" at the club
//  WHY THIS FILE EXISTS:
//    Anyone could hit /api/projects/123 to try and delete it.
//    We wrap that route with this middleware. It checks if the
//    request has a valid JWT token. If yes, it lets them through.
//    If not, it rejects them immediately.
// ============================================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // 1. Check if the token exists in the headers
  // Tokens are usually sent via headers like this: "Authorization: Bearer <the_token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. Extract the actual token (split by space and take the second part)
      token = req.headers.authorization.split(" ")[1];

      // 3. Verify the token using our secret key
      // This decodes the info we put in it earlier (which was just the user ID: { id })
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Fetch the user from the database that matches the decoded ID
      // .select("-password") means "bring me the user object, but remove the password"
      // We attach this safe user data to `req.user`
      req.user = await User.findById(decoded.id).select("-password");

      // 5. Let them through to the actual route!
      // 'next()' means "Everything looks good, continue to the original function"
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // 6. If there's no token at all, reject immediately
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
