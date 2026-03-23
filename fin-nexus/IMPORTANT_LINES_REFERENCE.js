// ============================================================
//  FILE: IMPORTANT_LINES_REFERENCE.js
//  PURPOSE: A quick-reference guide to every critical line
//  in the CapitalVue MERN stack project. Each entry shows
//  WHAT the line does, WHY it matters, and WHERE it lives.
//  This file is NOT executed — it's for learning only.
// ============================================================


// ════════════════════════════════════════════════════════════
//  SECTION 1: BACKEND — SERVER SETUP (server.js)
// ════════════════════════════════════════════════════════════

// FILE: backend/server.js — Line 3
const cors = require("cors");
// REASON: Imports the CORS package. CORS = Cross-Origin Resource Sharing.
//         React runs on port 5173, Express runs on port 5001.
//         Browsers block requests between different ports by default.
//         We need CORS to allow this cross-port communication.

// FILE: backend/server.js — Line 16
// app.use(cors());
// REASON: ⭐ THE MOST IMPORTANT LINE IN THE ENTIRE PROJECT ⭐
//         This single line tells Express: "Allow ANY website to call my API."
//         Without this, React gets a "CORS blocked" error and NOTHING works.
//         This is what JOINS the frontend to the backend.

// FILE: backend/server.js — Line 17
// app.use(express.json());
// REASON: Tells Express to automatically parse JSON data from incoming requests.
//         When React sends { name: "John", email: "john@mail.com" },
//         Express can read it using req.body.name and req.body.email.
//         Without this, req.body would be UNDEFINED.

// FILE: backend/server.js — Line 21
// app.use("/api/users", require("./routes/authRoutes"));
// REASON: Route Registration. This tells Express:
//         "When someone visits /api/users, use the authRoutes file."
//         So React's axios.post('http://localhost:5001/api/users') 
//         gets routed to authRoutes.js → authController.js

// FILE: backend/server.js — Line 22
// app.use("/api/portfolio", require("./routes/portfolioRoutes"));
// REASON: Same concept — maps /api/portfolio URLs to portfolio logic.
//         This is a PROTECTED route (requires JWT token).


// ════════════════════════════════════════════════════════════
//  SECTION 2: BACKEND — DATABASE CONNECTION (config/db.js)
// ════════════════════════════════════════════════════════════

// FILE: backend/config/db.js — Line 5
// const conn = await mongoose.connect(process.env.MONGO_URI);
// REASON: This connects Node.js to MongoDB Atlas (cloud database).
//         process.env.MONGO_URI reads the connection string from the .env file.
//         The .env file keeps passwords SECRET and out of your code.
//         If this line fails, NO data can be saved or retrieved.


// ════════════════════════════════════════════════════════════
//  SECTION 3: BACKEND — USER MODEL (models/User.js)
// ════════════════════════════════════════════════════════════

// FILE: backend/models/User.js — Lines 26-33
// userSchema.pre("save", async function (next) {
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });
// REASON: Password Hashing. This runs AUTOMATICALLY before every .save().
//         It converts "password123" into "$2a$10$xKz8Qr..."
//         so the real password is NEVER stored in the database.
//         If a hacker steals your database, they can't read passwords.

// FILE: backend/models/User.js — Lines 36-38
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };
// REASON: Password Verification. During login, this compares the 
//         user's typed password against the hashed version in MongoDB.
//         bcrypt.compare() handles the decryption automatically.


// ════════════════════════════════════════════════════════════
//  SECTION 4: BACKEND — JWT TOKEN (config/generateToken.js)
// ════════════════════════════════════════════════════════════

// FILE: backend/config/generateToken.js — Lines 3-6
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
// };
// REASON: Creates an encrypted "pass" (JWT token) containing the user's ID.
//         jwt.sign() takes the user's ID + a secret key → creates a token string.
//         This token is sent back to React after login.
//         React stores it and sends it with every future request to prove identity.
//         The token expires after 30 days for security.


// ════════════════════════════════════════════════════════════
//  SECTION 5: BACKEND — AUTH CONTROLLER (controllers/authController.js)
// ════════════════════════════════════════════════════════════

// FILE: backend/controllers/authController.js — Line 16
// const user = await User.create({ name, email, password });
// REASON: This creates a new user document in MongoDB.
//         Before saving, the pre("save") hook automatically hashes the password.
//         If the email already exists (unique: true in the schema),
//         MongoDB throws an error and the catch block handles it.

// FILE: backend/controllers/authController.js — Line 42
// if (user && (await user.matchPassword(password))) {
// REASON: Login verification. Two checks in one line:
//         1. Does the user exist? (user is not null)
//         2. Does the password match? (matchPassword returns true/false)
//         Only if BOTH are true, the user gets a JWT token.


// ════════════════════════════════════════════════════════════
//  SECTION 6: BACKEND — JWT MIDDLEWARE (middleware/authMiddleware.js)
// ════════════════════════════════════════════════════════════

// FILE: backend/middleware/authMiddleware.js
// const token = req.headers.authorization.split(" ")[1];
// REASON: Extracts the JWT token from the request header.
//         React sends: "Bearer eyJhbGci..."
//         .split(" ")[1] gets just "eyJhbGci..." (the actual token)

// const decoded = jwt.verify(token, process.env.JWT_SECRET);
// REASON: Decodes the token to find the user's ID hidden inside it.
//         If the token is fake or expired, jwt.verify() throws an error
//         and the user gets a 401 Unauthorized response.

// req.user = await User.findById(decoded.id).select("-password");
// REASON: Finds the full user document from MongoDB using the decoded ID.
//         .select("-password") excludes the password field for security.
//         Now req.user is available in ALL subsequent controller functions.


// ════════════════════════════════════════════════════════════
//  SECTION 7: BACKEND — PROTECTED ROUTES (routes/portfolioRoutes.js)
// ════════════════════════════════════════════════════════════

// FILE: backend/routes/portfolioRoutes.js
// router.route("/").get(protect, getPortfolio).post(protect, addAsset);
// REASON: The "protect" middleware runs FIRST before getPortfolio or addAsset.
//         Flow: Request comes in → protect checks JWT → if valid → controller runs
//                                                     → if invalid → 401 error
//         This is how we ensure only logged-in users can access their portfolio.


// ════════════════════════════════════════════════════════════
//  SECTION 8: FRONTEND — REACT ENTRY POINT (src/main.jsx)
// ════════════════════════════════════════════════════════════

// FILE: frontend/src/main.jsx — Lines 4-8
// createRoot(document.getElementById('root')).render(<App />);
// REASON: This mounts the entire React app into the HTML page.
//         index.html has <div id="root"></div>
//         React takes over that div and renders the App component inside it.


// ════════════════════════════════════════════════════════════
//  SECTION 9: FRONTEND — ROUTER (src/App.jsx)
// ════════════════════════════════════════════════════════════

// FILE: frontend/src/App.jsx
// <Route path="/register" element={<Register />} />
// <Route path="/login" element={<Login />} />
// <Route path="/dashboard" element={<Dashboard />} />
// REASON: Client-side routing. When the URL changes to /login,
//         React swaps in the Login component WITHOUT refreshing the page.
//         This is what makes it a Single Page Application (SPA).

// FILE: frontend/src/App.jsx
// <Button component={Link} to="/login">Login</Button>
// REASON: The Link component from react-router-dom changes the URL
//         without causing a full page reload. This is faster than <a href>.


// ════════════════════════════════════════════════════════════
//  SECTION 10: FRONTEND → BACKEND COMMUNICATION (Axios calls)
// ════════════════════════════════════════════════════════════

// FILE: frontend/src/components/Auth/Register.jsx — Line 22
// await axios.post('http://localhost:5001/api/users', formData);
// REASON: ⭐ THIS IS WHERE REACT TALKS TO EXPRESS ⭐
//         axios.post() sends an HTTP POST request.
//         'http://localhost:5001/api/users' = the backend URL
//         formData = { name, email, password } object from the form
//         Express receives this and runs registerUser() controller

// FILE: frontend/src/components/Auth/Login.jsx — Line 22
// const response = await axios.post('http://localhost:5001/api/users/login', formData);
// REASON: Sends login credentials to Express.
//         If password matches, Express returns { _id, name, token }

// FILE: frontend/src/components/Auth/Login.jsx — Line 25
// localStorage.setItem('token', response.data.token);
// REASON: Saves the JWT token in the browser's localStorage.
//         localStorage persists even if the user closes the browser tab.
//         The Dashboard component reads this token later to make API calls.

// FILE: frontend/src/components/Dashboard.jsx — Lines 33-35
// const response = await axios.get('http://localhost:5001/api/portfolio', {
//   headers: { Authorization: `Bearer ${token}` }
// });
// REASON: ⭐ AUTHENTICATED API CALL ⭐
//         This fetches the user's portfolio from Express.
//         The JWT token is sent in the Authorization header.
//         Express's protect middleware reads this token to verify identity.
//         Only then does it return the portfolio data for THIS specific user.

// FILE: frontend/src/components/Home.jsx — Line 14
// axios.get('http://localhost:5001/', { timeout: 5000 })
// REASON: Health check. Hits the root route to see if the backend is alive.
//         timeout: 5000 means "give up after 5 seconds if no response"
//         The response "CapitalVue API Running" proves the connection works.


// ════════════════════════════════════════════════════════════
//  SECTION 11: FRONTEND — NAVIGATION GUARD (Dashboard.jsx)
// ════════════════════════════════════════════════════════════

// FILE: frontend/src/components/Dashboard.jsx — Lines 23-27
// useEffect(() => {
//   if (!token) { navigate('/login'); return; }
//   fetchPortfolio();
// }, [navigate]);
// REASON: Protection on the frontend side.
//         If someone tries to visit /dashboard without being logged in,
//         there's no token in localStorage, so they get redirected to /login.
//         If they ARE logged in, it fetches their portfolio data.


// ════════════════════════════════════════════════════════════
//  SECTION 12: ENVIRONMENT VARIABLES (backend/.env)
// ════════════════════════════════════════════════════════════

// FILE: backend/.env
// MONGO_URI=mongodb+srv://...
// REASON: The MongoDB connection string with your database password.
//         Stored in .env so it's NOT visible in your code on GitHub.

// JWT_SECRET=finance_secret_key_99
// REASON: The secret key used to encrypt/decrypt JWT tokens.
//         If someone knows this key, they can forge tokens.
//         That's why it's in .env and not in the code.

// PORT=5001
// REASON: Which port the Express server listens on.
//         React calls this port in every axios request.


// ════════════════════════════════════════════════════════════
//  SUMMARY: THE COMPLETE DATA FLOW
// ════════════════════════════════════════════════════════════
//
//  1. User opens http://localhost:5173/       → React loads App.jsx
//  2. User clicks Register                   → React shows Register.jsx
//  3. User fills form and clicks Submit      → axios.post('/api/users', data)
//  4. Express receives request               → cors() allows it
//  5. express.json() parses the body         → req.body = {name, email, password}
//  6. authRoutes maps URL to controller      → registerUser() runs
//  7. User.create() saves to MongoDB         → password auto-hashed by pre("save")
//  8. generateToken() creates JWT            → sent back to React
//  9. React redirects to Login page          → navigate('/login')
// 10. User logs in                           → axios.post('/api/users/login')
// 11. Express checks password                → user.matchPassword()
// 12. JWT token returned                     → React saves in localStorage
// 13. React redirects to Dashboard           → navigate('/dashboard')
// 14. Dashboard loads                        → checks if token exists
// 15. axios.get('/api/portfolio', Bearer)    → protect middleware verifies JWT
// 16. portfolioController fetches data       → Portfolio.find({user: req.user._id})
// 17. Data sent back to React               → rendered as Material UI cards
//
// ════════════════════════════════════════════════════════════
