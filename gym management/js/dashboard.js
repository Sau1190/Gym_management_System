// ✅ Firebase Modular SDK Imports
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  push,
  set,
  update,
  remove,
  get,
  child
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
import { auth, database } from "/gym management/js/firebase-config.js";

// ✅ Auth check
onAuthStateChanged(auth, function(user) {
  if (!user) {
    alert("Unauthorized access.");
    window.location.href = "/gym management/index.html";
  }
});

// ✅ Add New Member
window.addMember = function () {
  const name = document.getElementById("memberName").value.trim();
  const email = document.getElementById("memberEmail").value.trim();
  const packageType = document.getElementById("memberPackage").value;

  if (!name || !email) return showStatus("Please fill all fields!");

  push(ref(database, "members"), {
    name,
    email,
    package: packageType,
    joinedOn: new Date().toISOString()
  }).then(() => {
    showStatus("✅ Member added successfully!");
    logAction("admin", `Added member: ${email}`, "Members");
  });
};

// ✅ Load Member by Email
window.loadMember = function () {
  const email = document.getElementById("searchEmail").value.trim();
  if (!email) return showStatus("Please enter email to search.");

  get(ref(database, "members")).then((snapshot) => {
    let found = false;
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      if (data.email === email) {
        found = true;
        document.getElementById("memberInfo").innerHTML = `
          <input id="editName" value="${data.name}" />
          <input id="editPackage" value="${data.package}" />
          <button onclick="updateMember('${childSnapshot.key}')">Update</button>
          <button onclick="deleteMember('${childSnapshot.key}')">Delete</button>
        `;
      }
    });
    if (!found) showStatus("❌ Member not found!");
  });
};

// ✅ Update Member
window.updateMember = function (key) {
  const name = document.getElementById("editName").value.trim();
  const packageType = document.getElementById("editPackage").value;

  update(ref(database, "members/" + key), { name, package: packageType })
    .then(() => {
      showStatus("✅ Member updated!");
      logAction("admin", `Updated member ${key}`, "Members");
    });
};

// ✅ Delete Member
window.deleteMember = function (key) {
  remove(ref(database, "members/" + key))
    .then(() => {
      showStatus("🗑️ Member deleted!");
      document.getElementById("memberInfo").innerHTML = "";
      logAction("admin", `Deleted member ${key}`, "Members");
    });
};

// ✅ Generate Bill
window.generateBill = function () {
  const email = document.getElementById("billEmail").value.trim();
  const amount = document.getElementById("billAmount").value;
  const date = document.getElementById("billDate").value;

  if (!email || !amount || !date) return showStatus("Please complete all bill fields.");

  push(ref(database, "bills"), {
    email,
    amount,
    date,
    createdOn: new Date().toISOString()
  }).then(() => {
    showStatus("💳 Bill generated!");
    logAction("admin", `Generated bill for ${email}`, "Billing");
  });
};

// ✅ Assign Fee Package
window.assignFeePackage = function () {
  const email = document.getElementById("feeEmail").value.trim();
  const selectedPackage = document.getElementById("feePackage").value;

  get(ref(database, "members")).then((snapshot) => {
    let found = false;
    snapshot.forEach((childSnapshot) => {
      if (childSnapshot.val().email === email) {
        found = true;
        update(ref(database, "members/" + childSnapshot.key), {
          package: selectedPackage
        }).then(() => {
          showStatus(`📦 Fee package '${selectedPackage}' assigned.`);
          logAction("admin", `Assigned package to ${email}`, "Fee Package");
        });
      }
    });
    if (!found) showStatus("❌ Member not found!");
  });
};

// ✅ Send Notification
window.sendNotification = function () {
  const email = document.getElementById("notifyEmail").value.trim();
  const message = document.getElementById("notifyMessage").value.trim();

  if (!email || !message) return showStatus("Please fill both fields.");

  push(ref(database, "notifications"), {
    email,
    message,
    date: new Date().toISOString()
  }).then(() => {
    showStatus("📩 Notification sent!");
    logAction("admin", `Sent notification to ${email}`, "Notifications");
  });
};

// ✅ Export Member Report
window.exportReports = function () {
  get(ref(database, "members")).then(snapshot => {
    let csv = "Name,Email,Package,JoinedOn\n";
    snapshot.forEach(child => {
      const m = child.val();
      csv += `${m.name},${m.email},${m.package},${m.joinedOn}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "members_report.csv";
    a.click();
  });
};

// ✅ Add Supplement
window.addSupplement = function () {
  const name = document.getElementById("supplementName").value.trim();
  const price = document.getElementById("supplementPrice").value;

  if (!name || !price) return showStatus("Fill both name and price.");

  push(ref(database, "supplements"), {
    name,
    price,
    addedOn: new Date().toISOString()
  }).then(() => {
    showStatus("🧃 Product added to store!");
    logAction("admin", `Added supplement: ${name}`, "Supplements");
  });
};

// ✅ Assign Diet Plan
window.assignDiet = function () {
  const email = document.getElementById("dietEmail").value.trim();
  const plan = document.getElementById("dietPlan").value.trim();

  if (!email || !plan) return showStatus("Fill both fields.");

  push(ref(database, "diet_plans"), {
    email,
    plan,
    date: new Date().toISOString()
  }).then(() => {
    showStatus("🥗 Diet assigned!");
    logAction("admin", `Assigned diet to ${email}`, "Diet Plans");
  });
};

// ✅ Logout
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "/gym management/index.html";
  });
};

// ✅ Show Status
function showStatus(msg) {
  const el = document.getElementById("statusMsg");
  el.innerText = msg;
  el.style.opacity = 1;
  setTimeout(() => { el.style.opacity = 0 }, 3000);
}

// ✅ Log Admin Actions
function logAction(user, action, module) {
  push(ref(database, "logs"), {
    user,
    action,
    module,
    time: new Date().toISOString()
  });
}