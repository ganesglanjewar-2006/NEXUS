// ============================================================
//  FILE: public/js/api.js
//  ROLE: The "Messenger Boy" between the Frontend HTML and Backend API
//  WHY THIS FILE EXISTS:
//    When you click "Login" on an HTML form, it normally refreshes the whole page.
//    We don't want that! We want to silently send the data to the backend,
//    wait for the token, save it, and *then* redirect.
// ============================================================

// A helper function so we don't have to type localhost:5000 everywhere
const API_URL = "http://localhost:5000/api";

// Helper function to get the token for protected routes
const getAuthHeaders = () => {
    const token = localStorage.getItem("nexusToken");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. REGISTER FUNCTIONALITY
    // ==========================================
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Stop the page from refreshing!
            
            // Get what the user typed in the boxes
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const errorDiv = document.getElementById("register-error");
            
            try {
                // Send it to the backend route we made in Step 3
                const response = await fetch(`${API_URL}/auth/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Success! Save the token in the browser's memory
                    localStorage.setItem("nexusToken", data.token);
                    localStorage.setItem("nexusUser", JSON.stringify({ name: data.name, email: data.email }));
                    // Instantly redirect to the locked dashboard area
                    window.location.href = "/dashboard";
                } else {
                    // Show the error message (like "User already exists")
                    errorDiv.innerText = data.message;
                    errorDiv.style.display = "block";
                }
            } catch (err) {
                errorDiv.innerText = "Error connecting to server.";
                errorDiv.style.display = "block";
            }
        });
    }

    // ==========================================
    // 2. LOGIN FUNCTIONALITY
    // ==========================================
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const errorDiv = document.getElementById("login-error");
            
            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    localStorage.setItem("nexusToken", data.token);
                    localStorage.setItem("nexusUser", JSON.stringify({ name: data.name, email: data.email }));
                    window.location.href = "/dashboard";
                } else {
                    errorDiv.innerText = data.message;
                    errorDiv.style.display = "block";
                }
            } catch (err) {
                errorDiv.innerText = "Error connecting to server.";
                errorDiv.style.display = "block";
            }
        });
    }

    // ==========================================
    // 3. DASHBOARD PAGE (Load Stats)
    // ==========================================
    if (window.location.pathname === "/dashboard") {
        const loadDashboardStats = async () => {
            try {
                // Fetch Clients
                const clientRes = await fetch(`${API_URL}/clients`, { headers: getAuthHeaders() });
                const clients = await clientRes.json();
                document.getElementById("dash-client-count").innerText = clients.length || 0;

                // Fetch Projects
                const projRes = await fetch(`${API_URL}/projects`, { headers: getAuthHeaders() });
                const projects = await projRes.json();
                document.getElementById("dash-project-count").innerText = projects.length || 0;

                // Fetch Tasks
                const taskRes = await fetch(`${API_URL}/tasks`, { headers: getAuthHeaders() });
                const tasks = await taskRes.json();
                document.getElementById("dash-task-count").innerText = tasks.length || 0;
            } catch (err) {
                console.error("Failed to load stats", err);
            }
        };
        loadDashboardStats();
    }

    // ==========================================
    // 4. CLIENTS PAGE (View and Add)
    // ==========================================
    if (window.location.pathname === "/clients") {
        const tableBody = document.getElementById("clients-table-body");
        
        // --- Fetch and Display Clients ---
        const loadClients = async () => {
            try {
                const res = await fetch(`${API_URL}/clients`, { headers: getAuthHeaders() });
                const clients = await res.json();
                
                tableBody.innerHTML = ""; // Clear "Loading..." message
                
                if (clients.length === 0) {
                    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center">No clients found. Add one above!</td></tr>`;
                    return;
                }

                // Loop through array and build HTML table rows
                clients.forEach(c => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td><strong>${c.name}</strong></td>
                        <td>${c.email}</td>
                        <td>${c.phone}</td>
                        <td>${c.company}</td>
                        <td><button class="btn-danger" onclick="deleteClient('${c._id}')">Delete</button></td>
                    `;
                    tableBody.appendChild(row);
                });
            } catch (error) {
                tableBody.innerHTML = `<tr><td colspan="5" style="color:red; text-align:center;">Failed to load clients.</td></tr>`;
            }
        };

        // Needs to be global so the inline onclick="deleteClient()" works
        window.deleteClient = async (id) => {
            if(confirm("Are you sure you want to delete this client?")) {
                await fetch(`${API_URL}/clients/${id}`, {
                    method: "DELETE",
                    headers: getAuthHeaders()
                });
                loadClients(); // Reload the table instantly!
            }
        }

        // --- Handle 'Add New Client' Form ---
        const addClientForm = document.getElementById("add-client-form");
        addClientForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const newClient = {
                name: document.getElementById("clientName").value,
                email: document.getElementById("clientEmail").value,
                phone: document.getElementById("clientPhone").value,
                company: document.getElementById("clientCompany").value
            };

            const res = await fetch(`${API_URL}/clients`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(newClient)
            });

            if (res.ok) {
                addClientForm.reset(); // Clear the text boxes
                loadClients();         // Reload the table
            } else {
                alert("Failed to create client.");
            }
        });

        // Load initially
        loadClients();
    }

    // ==========================================
    // 5. PROJECTS PAGE (View and Add)
    // ==========================================
    if (window.location.pathname === "/projects") {
        const projClientSelect = document.getElementById("projClient");
        const projectsContainer = document.getElementById("projects-container");

        // --- Fetch Clients for the Dropdown ---
        const loadClientDropdown = async () => {
            try {
                const res = await fetch(`${API_URL}/clients`, { headers: getAuthHeaders() });
                const clients = await res.json();
                
                projClientSelect.innerHTML = `<option value="">-- Select Client --</option>`;
                clients.forEach(c => {
                    projClientSelect.innerHTML += `<option value="${c._id}">${c.name} (${c.company})</option>`;
                });
            } catch (err) {
                console.error("Failed to load clients dropdown");
            }
        };

        // --- Fetch and Display Projects ---
        const loadProjects = async () => {
            try {
                const res = await fetch(`${API_URL}/projects`, { headers: getAuthHeaders() });
                const projects = await res.json();
                
                projectsContainer.innerHTML = "";
                
                if (projects.length === 0) {
                    projectsContainer.innerHTML = `<p>No projects found. Create one above!</p>`;
                    return;
                }

                projects.forEach(p => {
                    // Decide badge color based on status
                    let badgeClass = "badge-gray";
                    if(p.status === "In Progress") badgeClass = "badge-blue";
                    if(p.status === "Completed") badgeClass = "badge-green";

                    // Note: p.client.name works because we used .populate() in the backend!
                    const clientName = p.client ? p.client.name : "Unknown Client";

                    const card = document.createElement("div");
                    card.className = "project-card";
                    card.innerHTML = `
                        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                            <h3>${p.name}</h3>
                            <span class="badge ${badgeClass}">${p.status}</span>
                        </div>
                        <p style="color:#64748b; margin-bottom:15px; font-size:0.9rem;">
                           <i class="fa-solid fa-user"></i> Client: <strong>${clientName}</strong>
                        </p>
                        <p style="margin-bottom:15px;">${p.description}</p>
                        <hr style="border:none; border-top:1px solid #e2e8f0; margin-bottom:15px;">
                        <button class="btn-danger" style="padding:0.3rem 0.8rem; font-size:0.8rem;" onclick="deleteProject('${p._id}')">
                            <i class="fa-solid fa-trash"></i> Delete
                        </button>
                    `;
                    projectsContainer.appendChild(card);
                });
            } catch (error) {
                projectsContainer.innerHTML = `<p style="color:red;">Failed to load projects.</p>`;
            }
        };

        window.deleteProject = async (id) => {
            if(confirm("Delete this project?")) {
                await fetch(`${API_URL}/projects/${id}`, {
                    method: "DELETE",
                    headers: getAuthHeaders()
                });
                loadProjects();
            }
        }

        // --- Handle 'Add New Project' Form ---
        const addProjectForm = document.getElementById("add-project-form");
        addProjectForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const newProject = {
                name: document.getElementById("projName").value,
                clientId: document.getElementById("projClient").value,
                description: document.getElementById("projDesc").value,
                deadline: document.getElementById("projDeadline").value,
                status: document.getElementById("projStatus").value,
            };

            const res = await fetch(`${API_URL}/projects`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(newProject)
            });

            if (res.ok) {
                addProjectForm.reset(); 
                loadProjects(); // Reload the cards instantly
            } else {
                alert("Failed to create project.");
            }
        });

        // Load initially
        loadClientDropdown();
        loadProjects();
    }

    // ==========================================
    // 6. TASKS PAGE (View and Add)
    // ==========================================
    if (window.location.pathname === "/tasks") {
        const taskProjectSelect = document.getElementById("taskProject");
        const tasksTable = document.getElementById("tasks-table-body");

        // --- Fetch Projects for the Dropdown ---
        const loadProjectDropdown = async () => {
             try {
                 const res = await fetch(`${API_URL}/projects`, { headers: getAuthHeaders() });
                 const projects = await res.json();
                 
                 taskProjectSelect.innerHTML = `<option value="">-- Select Project --</option>`;
                 projects.forEach(p => {
                     taskProjectSelect.innerHTML += `<option value="${p._id}">${p.name}</option>`;
                 });
             } catch (err) {
                 console.error("Failed to load projects dropdown");
             }
        };

        // --- Fetch and Display Tasks ---
        const loadTasks = async () => {
            try {
                const res = await fetch(`${API_URL}/tasks`, { headers: getAuthHeaders() });
                const tasks = await res.json();
                
                tasksTable.innerHTML = "";
                
                if (tasks.length === 0) {
                    tasksTable.innerHTML = `<tr><td colspan="5" style="text-align:center">No tasks found. Create one above!</td></tr>`;
                    return;
                }

                tasks.forEach(t => {
                    // Decide badge color based on Boolean status
                    let badgeHTML = t.isCompleted 
                        ? `<span class="badge badge-green">Done</span>` 
                        : `<span class="badge badge-gray">Pending</span>`;

                    // Note: t.project.name works because we used .populate() in the backend!
                    const projName = t.project ? t.project.name : "Unknown Project";

                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${badgeHTML}</td>
                        <td><strong>${t.title}</strong></td>
                        <td>${t.description}</td>
                        <td>${projName}</td>
                        <td><button class="btn-danger" onclick="deleteTask('${t._id}')">Delete</button></td>
                    `;
                    tasksTable.appendChild(row);
                });
            } catch (error) {
                tasksTable.innerHTML = `<tr><td colspan="5" style="color:red; text-align:center;">Failed to load tasks.</td></tr>`;
            }
        };

        window.deleteTask = async (id) => {
            if(confirm("Delete this task?")) {
                await fetch(`${API_URL}/tasks/${id}`, {
                    method: "DELETE",
                    headers: getAuthHeaders()
                });
                loadTasks();
            }
        }

        // --- Handle 'Add New Task' Form ---
        const addTaskForm = document.getElementById("add-task-form");
        addTaskForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const newTask = {
                title: document.getElementById("taskTitle").value,
                projectId: document.getElementById("taskProject").value,
                description: document.getElementById("taskDesc").value,
                isCompleted: document.getElementById("taskStatus").value === "true", // convert string to boolean
            };

            const res = await fetch(`${API_URL}/tasks`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(newTask)
            });

            if (res.ok) {
                addTaskForm.reset(); 
                loadTasks(); // Reload the table instantly
            } else {
                alert("Failed to create task.");
            }
        });

        // Load initially
        loadProjectDropdown();
        loadTasks();
    }
});
