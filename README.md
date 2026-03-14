# Nexus - Client & Project Management SaaS

## 📄 What to Put on Your Resume

**Nexus - Client & Project Management SaaS**
*Full-Stack Web Application (Node.js, Express, MongoDB, EJS)*
* **Full-Stack Architecture:** Architected and developed a complete MEN-stack (MongoDB, Express, Node.js) application utilizing EJS templates for secure, server-side rendered frontend views.
* **RESTful API Design:** Built a robust backend API featuring full CRUD capabilities for Users, Clients, Projects, and Tasks, utilizing Express Routers and Controllers for clean code separation.
* **Authentication & Security:** Implemented secure user authentication using JSON Web Tokens (JWT) and `bcryptjs` for password hashing. Created custom middleware to protect private API routes and enforce user data isolation.
* **Database Modeling:** Designed a relational document database schema using Mongoose. Utilized MongoDB `ObjectId` references to build complex relationships (e.g., linking Tasks to Projects, and Projects to specific Clients and Users).
* **Dynamic Frontend Integration:** Engineered a responsive, single-page-like experience using Vanilla JavaScript and the `fetch` API for asynchronous HTTP requests, dynamic DOM manipulation, and `localStorage` token management.

---

## 🧠 Core Concepts You Must Know for Interviews

If an interviewer asks you how this app works, here are the most important Javascript and Web concepts we used, explained simply:

### 1. `addEventListener` (The Listener)
* **Where we used it:** In `api.js` on our HTML forms (e.g., `addTaskForm.addEventListener("submit", ...)`)
* **What it does:** Web pages are normally "dumb"—they just sit there. An Event Listener attaches a radar to an HTML element (like a Button or a Form). It tells the browser: *"Wait here silently. The exact microsecond the user clicks this button, run my Javascript function."*
* **Why it's important:** We attached to the `"submit"` event of our forms. And the *very first* line of code inside the listener is `e.preventDefault()`. By default, when you submit an HTML form, the web browser **refreshes the entire page**. We stopped that from happening so our app feels smooth and fast like a modern SaaS product!

### 2. `fetch()` and `async` / `await` (The Messenger)
* **Where we used it:** Everywhere in `api.js` to get Data from our backend.
* **What it does:** `fetch()` is modern JavaScript's built-in tool for making HTTP requests (AJAX) to a server. However, talking to a server takes time (maybe 0.5 seconds). If JavaScript stopped and waited for 0.5 seconds, your whole website would freeze!
* **Why it's important:** `async` and `await` are the magic words that fix this. They tell JavaScript: *"Go fetch this data in the background, but let the user keep scrolling the website. `await` here until the data physically comes back from the server, and then continue running the rest of the code."*

### 3. JWT (JSON Web Tokens) & `localStorage` (The VIP Pass)
* **Where we used it:** `authMiddleware.js` (Backend) and `auth.js` (Frontend).
* **What it does:** HTTP is "stateless"—meaning the server has total amnesia. Every time you ask to view the Dashboard, the server forgets who you are. 
* **Why it's important:** When you log in, the server generates a cryptographically signed string (the JWT) and gives it to your browser. Your browser saves it in `localStorage` (a tiny hard drive built into Google Chrome). Now, every time `api.js` makes a `fetch()` request, it attaches that JWT to the 'Headers'. The server sees the JWT and says, *"Ah, I remember you. You are User 555. Here is your private data."*

### 4. Mongoose `.populate()` (The Database Joiner)
* **Where we used it:** In `projectController.js` and `taskController.js`.
* **What it does:** In our Database, a Task only knows the ID number of its Project (e.g., Project ID: `64b3f...`). It doesn't know the *name* of the Project.
* **Why it's important:** When we fetch the Tasks, we want to show the Project Name on the screen. Instead of writing complex double-queries, we tell Mongoose: `Task.find().populate("project")`. Mongoose automatically goes into the Project spreadsheet, grabs the actual Project object based on the ID, and merges it into the Task data for us.

### 5. MVC Architecture (Model, View, Controller)
* **Where we used it:** The entire folder structure of our Backend!
* **What it does:** It keeps code organized instead of putting 3,000 lines of code into `server.js`.
    * **Model:** (`models/User.js`) The blueprint of the data shape.
    * **View:** (`views/index.ejs`) The HTML/CSS the user physically sees.
    * **Controller:** (`controllers/authController.js`) The brain. The logic that handles the rules, talks to the Model, and sends data back to the View.

---

## 🎯 Top 3 Interview Questions You Will Be Asked

### Question 1: "Why did you choose MongoDB over a SQL database like MySQL or PostgreSQL?"
**How to Answer:** 
> "I chose MongoDB because my data models (Users, Clients, Projects) naturally fit into document-like structures. MongoDB allowed me to instantly embed arrays or build relationships using `ObjectId` references without writing complex, rigid, and slow SQL JOIN tables. Plus, MongoDB inherently speaks JSON, which perfectly matches how my Node.js backend and pure Javascript frontend handle data."

### Question 2: "How did you secure your API routes so someone couldn't just guess a URL and steal client data?"
**How to Answer:**
> "I built a custom authentication middleware in Express using JSON Web Tokens (JWT). When a user successfully logs in, the backend cryptographically signs a token with a secret key. Every route (like `/api/clients`) is wrapped in my `protect` middleware. The middleware intercepts the request, grabs the token from the `Authorization` header, verifies the signature, and automatically attaches the specific User ID to the request object. If the token is missing or faked, the server immediately rejects the request with a 401 error."


### Question 3: "If User A logs in, how did you guarantee they don't see the Projects created by User B?"
**How to Answer:**
> "Security doesn't stop at the authentication middleware. Even though they are logged in, I manually enforce data isolation at the Controller level. In my Mongoose Schema, every single Client, Project, and Task requires a `user` field that holds their `ObjectId`. In my Controller functions, when a user asks to view projects, I query `Project.find({ user: req.user.id })`. This ensures the database physically only returns rows created by that specific logged-in user."
