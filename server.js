require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;

//connect to db
connectDB.connectToMongoDB();

// Enable CORS for all routes
app.use(cors());

// API ROUTES
app.get("/questions", async (req, res) => {
  try {
    // Access the client from db.js
    const client = connectDB.client;

    // Access the database and collection
    const db = client.db("QuizDB");
    const collection = db.collection("QuizCollection");

    // Query all documents from the collection
    const questions = await collection.find({}).toArray();

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
