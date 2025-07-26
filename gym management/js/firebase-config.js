// Import the functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYWLxXAPfkMR1jxFunb-VoXZTvdDz74bQ",
  authDomain: "gym-management-5ed8e.firebaseapp.com",
  projectId: "gym-management-5ed8e",
  storageBucket: "gym-management-5ed8e.appspot.com",
  messagingSenderId: "90451612571",
  appId: "1:90451612571:web:5b6cfa12e5755e2a35873e",
  measurementId: "G-XTGMBKZHHY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);
