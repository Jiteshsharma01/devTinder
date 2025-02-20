const mongoose = require("mongoose");

// Connect to MongoDB
const connectDB = async () => {
  await mongoose.connect("mongodb://localhost:27017/devTinder");
};

module.exports = connectDB; 
