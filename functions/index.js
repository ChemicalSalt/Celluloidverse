const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.verifyRecaptcha = functions.https.onRequest(async (req, res) => {
  const token = req.body.token;
  const secret = "YOUR_SECRET_KEY"; // Replace with your actual secret key

  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
    { method: "POST" }
  );

  const data = await response.json();

  if (data.success) {
    res.status(200).send({ success: true });
  } else {
    res.status(400).send({ success: false, error: data["error-codes"] });
  }
});

