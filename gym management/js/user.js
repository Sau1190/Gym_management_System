import { auth, database } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  ref,
  onValue,
  get
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

// ✅ Check if user is authenticated
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/gym management/index.html"; // Or login page
  }
});

// ✅ Logout function
window.logout = function () {
  signOut(auth)
    .then(() => {
      window.location.href = "/gym management/index.html"; // Or login page
    })
    .catch((error) => {
      alert("Logout failed: " + error.message);
    });
};

// ✅ Search by member email
window.searchMember = function () {
  const email = document.getElementById("searchBox").value.trim();
  const membersRef = ref(database, "members");

  get(membersRef).then((snapshot) => {
    let result = "❌ Member not found.";
    snapshot.forEach((child) => {
      const data = child.val();
      if (data.email === email) {
        result = `
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Package:</strong> ${data.package}</p>
          <p><strong>Joined:</strong> ${new Date(data.joinedOn).toDateString()}</p>
        `;
      }
    });
    document.getElementById("searchResult").innerHTML = result;
  }).catch((error) => {
    alert("Error fetching data: " + error.message);
  });
};
