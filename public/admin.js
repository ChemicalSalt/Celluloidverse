import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const adminEmailInput = document.getElementById("adminEmail");
const adminPasswordInput = document.getElementById("adminPassword");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const loginResponse = document.getElementById("loginResponse");
const messagesDiv = document.getElementById("messages");

loginBtn.addEventListener("click", async () => {
  const email = adminEmailInput.value.trim();
  const password = adminPasswordInput.value.trim();
  if (!email || !password) {
    loginResponse.textContent = "Please enter credentials.";
    return;
  }
  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginResponse.textContent = "";
  } catch (error) {
    loginResponse.textContent = "Login failed.";
    console.error(error);
  }
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    adminEmailInput.style.display = "none";
    adminPasswordInput.style.display = "none";
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    messagesDiv.classList.remove("hidden");
    loadMessages();
  } else {
    adminEmailInput.style.display = "inline-block";
    adminPasswordInput.style.display = "inline-block";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    messagesDiv.classList.add("hidden");
    messagesDiv.innerHTML = "";
  }
});

async function loadMessages() {
  try {
    const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    messagesDiv.innerHTML = "<h3>Submitted Messages:</h3>";
    snapshot.forEach(doc => {
      const d = doc.data();
      messagesDiv.innerHTML += `
        <div class="msg">
          <strong>Name:</strong> ${sanitize(d.name)}<br>
          <strong>Email:</strong> ${sanitize(d.email)}<br>
          <strong>Message:</strong> ${sanitize(d.message)}
        </div>
      `;
    });
  } catch (err) {
    messagesDiv.innerHTML = "<p>Error loading messages.</p>";
    console.error(err);
  }
}

function sanitize(str) {
  return str.replace(/[&<>"'`=\/]/g, s => ({
    '&': "&amp;", '<': "&lt;", '>': "&gt;",
    '"': "&quot;", "'": "&#39;", '/': "&#x2F;", '`': "&#x60;", '=': "&#x3D;"
  }[s]));
}
