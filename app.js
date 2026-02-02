require("dotenv").config();

const connectDB = require("./db");

connectDB();

console.log("App is running");

