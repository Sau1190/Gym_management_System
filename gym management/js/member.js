import { auth, database } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  ref,
  onValue,
  query,
  orderByChild,
  equalTo
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

// Auth check
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadBills(user.email);
    loadNotifications(user.email);
  } else {
    alert("Unauthorized access. Please login.");
    window.location.href = "/gym management/index.html";
  }
});

// Load Bills
function loadBills(email) {
  const billRef = query(ref(database, "bills"), orderByChild("email"), equalTo(email));
  onValue(billRef, (snapshot) => {
    const list = document.getElementById("billList");
    list.innerHTML = "";
    if (!snapshot.exists()) {
      list.innerHTML = "<li>No bills found.</li>";
      return;
    }

    snapshot.forEach((child) => {
      const data = child.val();
      const li = document.createElement("li");
      li.textContent = `₹${data.amount} - ${data.date}`;
      list.appendChild(li);
    });
  });
}

// Load Notifications
function loadNotifications(email) {
  const notifyRef = query(ref(database, "notifications"), orderByChild("email"), equalTo(email));
  onValue(notifyRef, (snapshot) => {
    const list = document.getElementById("notificationsList");
    list.innerHTML = "";
    if (!snapshot.exists()) {
      list.innerHTML = "<li>No notifications found.</li>";
      return;
    }

    snapshot.forEach((child) => {
      const data = child.val();
      const li = document.createElement("li");
      li.textContent = `${data.message} - ${new Date(data.date).toLocaleString()}`;
      list.appendChild(li);
    });
  });
}

// Logout
window.logout = function () {
  signOut(auth)
    .then(() => {
      window.location.href = "/gym management/index.html";
    })
    .catch((error) => {
      alert("Logout failed: " + error.message);
    });
};
