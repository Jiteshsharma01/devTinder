const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
  // Validation of data
  validateSignUpData(req);

  const { firstName, lastName, emailId, password } = req.body;

  // Encrypt the password
  const passwordHash = await bcrypt.hash(password, 10);
  console.log({ firstName, lastName, emailId, password });
  
  // Creating a new instance of the User model
  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
  });
  
    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    res.status(404).send("ERROR : " + error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({emailId: emailId});
    if(!user) {
      throw new Error("Invalid credentials!");
    }
    const isPasswordValid = await user.validatePassword(password);
    console.log({isPasswordValid});
    

    if(isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8*3600000)
      });
      res.send("Login Successful!!");
    } else {
      throw new Error("Invalid credentials!");
    }
  } catch (error) {
    res.status(400).send('ERROR : ' + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log({user});
    
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR: " + err.message);
  }
})

// // Get user by email
// app.get("/user", async (req, res) => {
//   const userEmail = req.body.emailId;
//   try {
//     const users = await User.find({ emailId: userEmail });
//     if (users.length === 0) {
//       res.status(404).send("User not found!");
//     } else {
//       res.send(users);
//     }
//   } catch (error) {
//     res.status(400).send("Something went wrong!");
//   }
// });

// // Feed Api - get all users from database
// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (error) {
//     res.status(400).send("Something went wrong!");
//   }
// });

// // Delete a user from database
// app.delete("/user", async (req, res) => {
//   const userId = req.body.userId;

//   try {
//     const user = await User.findByIdAndDelete({ _id: userId });
//     // const user = await findByIdAndDelete(userId);
//     res.send("User deleted successfully!");
//   } catch (error) {
//     res.status(400).send("Something went wrong!");
//   }
// });

// // Update a user from database
// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params?.userId;
//   const data = req.body;
//   try {
//     const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       ALLOWED_UPDATES.includes(k)
//     );

//     if (!isUpdateAllowed) {
//       throw new Error("Update not allowed");
//     }
//     if (data?.skills.length > 10) {
//       throw new Error("Skill cannot be more than 10!");
//     }
//     const user = await User.findByIdAndUpdate({ _id: userId }, data);
//     res.send("User updated successfully");
//   } catch (error) {
//     res.status(400).send("UPDATE FAILED: " + err.message);
//   }
// });

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
