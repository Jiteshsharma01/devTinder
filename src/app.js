const express = require("express");
const User = require("./models/user");
const connectDB = require("./config/database");
const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Rohit",
    lastName: "Sharma",
    emailId: "rohit@sharma.com",
    password: "rohit@123",
  });
  try {
    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    res.status(404).send("Error creating user" + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("database connection established...");
    app.listen(7777, () => {
      console.log("listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("connection error");
  });
