const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;
require("dotenv").config();

//connect to db
connectDB();

const questions = require("./questions.json");
const { configDotenv } = require("dotenv");

// Enable CORS for all routes
app.use(cors());

// API ROUTES
app.get("/questions", async (req, res) => {
  try {
    // Fetch data from MongoDB
    const questions = await QuestionModel.find({});
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/questions/:level", async (req, res) => {
  const level = req.params.level;
  try {
    // Fetch data from MongoDB based on the level
    const questions = await QuestionModel.find({ level: level });
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// START THE SERVER
app.listen(PORT, () => {
  console.log(
    `Claire's awesome food quiz API running on http://localhost:${PORT}`
  );
});
