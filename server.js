const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const db = new sqlite3.Database("./questions.db");

// Enable CORS for all routes
app.use(cors());

// API ROUTES
app.get("/api/questions", (req, res) => {
  db.all(`SELECT * FROM questions`, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(rows);
    }
  });
});

app.get("/api/questions/:level", (req, res) => {
  const level = req.params.level;

  db.all(`SELECT * FROM questions WHERE LEVEL = ?`, [level], (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(rows);
    }
  });
});

// Function to import questions from questions.js
function importQuestions() {
  const questions = require("./questions.json");

  db.serialize(() => {
    const stmt = db.prepare(
      `INSERT INTO questions (question, option1, option2, option3, answer, level) VALUES (?,?,?,?,?,?)`
    );

    questions.forEach((question) => {
      stmt.run(
        question.question,
        question.option1,
        question.option2,
        question.option3,
        question.answer,
        question.level
      );
    });

    stmt.finalize();

    console.log("Questions data imported successfully");
  });
}

// START THE SERVER
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT,
        option1 TEXT,
        option2 TEXT,
        option3 TEXT,
        answer INTEGER,
        level INTEGER
        )`,
    () => {
      importQuestions(); // Call the function to import questions after table creation

      app.listen(PORT, () => {
        console.log(
          `Claire's awesome food quiz API running on http://localhost:${PORT}`
        );
      });
    }
  );
});
