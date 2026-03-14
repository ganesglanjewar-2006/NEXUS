// ============================================================
//  FILE: public/js/auth.js
//  ROLE: The Frontend Brain for Logging In/Out
//  WHY THIS FILE EXISTS:
//    When a user logs in, the backend sends us a JWT token.
//    We need a place to SAVE that token so the frontend doesn't forget
//    who we are when we click to a new page. We use localStorage!
//    This script runs on EVERY page because it's in footer.ejs.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Check if the user is logged in by looking for the token in the browser's memory
    const token = localStorage.getItem("nexusToken");
    const user = JSON.parse(localStorage.getItem("nexusUser"));

    // 2. We need to hide/show buttons based on if they are logged in
    const authLinks = document.querySelectorAll(".auth-required"); // Dashboard, Logout, etc
    const notAuthLinks = document.querySelectorAll(".not-auth");    // Login, Register

    if (token && user) {
        // Hey, they are logged in! 
        // Hide the Login link
        notAuthLinks.forEach(link => link.style.display = 'none');
        // Show the Dashboard and Logout links
        authLinks.forEach(link => link.style.display = 'block');
    } else {
        // Not logged in!
        // Show the Login link
        notAuthLinks.forEach(link => link.style.display = 'block');
        // Hide the Dashboard and Logout links
        authLinks.forEach(link => link.style.display = 'none');
    }

    // 3. Handle the Logout Click
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault(); // Stop the link from jumping anywhere
            // Best way to logout? Just delete the token from the browser's memory!
            localStorage.removeItem("nexusToken");
            localStorage.removeItem("nexusUser");
            // Send them back to the login page
            window.location.href = "/login";
        });
    }
});
