import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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
