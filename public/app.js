import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD7pTjTw4Sx7qNmqTVWYGbxWZchAplmm34",
  authDomain: "celluloidverse.firebaseapp.com",
  projectId: "celluloidverse",
  storageBucket: "celluloidverse.appspot.com",
  messagingSenderId: "945589485925",
  appId: "1:945589485925:web:1e977fdbbf84dd3d07e18c",
  measurementId: "G-HYQC9L5FTC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const contactForm = document.getElementById("contact-form");
const responseMsg = document.getElementById("response");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const recaptchaResponse = grecaptcha.getResponse();
  if (!recaptchaResponse) {
    responseMsg.classList.remove("hidden");
    responseMsg.textContent = "Please complete the CAPTCHA.";
    return;
  }

  const name = sanitize(document.getElementById("name").value.trim());
  const email = sanitize(document.getElementById("email").value.trim());
  const message = sanitize(document.getElementById("message").value.trim());

  if (!name || !email || !message) {
    responseMsg.classList.remove("hidden");
    responseMsg.textContent = "Please fill in all fields.";
    return;
  }

  try {
    await addDoc(collection(db, "messages"), {
      name, email, message, timestamp: Date.now()
    });
    responseMsg.classList.remove("hidden");
    responseMsg.textContent = "Message sent!";
    contactForm.reset();
    setTimeout(() => responseMsg.classList.add("hidden"), 4000);
  } catch (error) {
    responseMsg.classList.remove("hidden");
    responseMsg.textContent = "Error sending message.";
    console.error(error);
  }
});

function sanitize(str) {
  return str.replace(/[&<>"'`=\/]/g, s => ({
    '&': "&amp;", '<': "&lt;", '>': "&gt;",
    '"': "&quot;", "'": "&#39;", '/': "&#x2F;", '`': "&#x60;", '=': "&#x3D;"
  }[s]));
}
