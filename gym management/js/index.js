// ✅ Import Firebase auth from your firebase-config file
import { auth } from "./firebase-config.js";

// ✅ Import Firebase Auth methods
import {
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// ✅ Show the selected login form and hide others
window.openLogin = function (evt, loginType) {
  const forms = document.querySelectorAll(".login-form");
  forms.forEach(form => (form.style.display = "none"));
  const targetForm = document.getElementById(loginType);
  if (targetForm) {
    targetForm.style.display = "block";
    targetForm.classList.add("fade-in");
  }
};

// ✅ Role-based login logic
window.login = function (role) {
  const email = document.getElementById(`${role}Email`)?.value.trim();
  const password = document.getElementById(`${role}Password`)?.value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert(`${capitalize(role)} logged in successfully!`);
      redirectToDashboard(role);
    })
    .catch(error => {
      alert("Login failed: " + error.message);
    });
};

// ✅ Logout logic
window.logout = function () {
  signOut(auth)
    .then(() => {
      alert("Logged out successfully");
      window.location.href = "/gym management/index.html";
    })
    .catch(error => {
      alert("Logout failed: " + error.message);
    });
};

// ✅ Capitalize first letter (for alert)
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ✅ Redirect users to correct dashboard
function redirectToDashboard(role) {
  const basePath = "/gym management";
  switch (role) {
    case "admin":
      window.location.href = `${basePath}/admin.html`;
      break;
    case "member":
      window.location.href = `${basePath}/members.html`;
      break;
    case "user":
      window.location.href = `${basePath}/user.html`;
      break;
    default:
      alert("Unknown role");
  }
}
