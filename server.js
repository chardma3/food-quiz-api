const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const db = new sqlite3.Database("./questions.db");
const questions = require("./questions.json");

// Enable CORS for all routes
app.use(cors());

// Function to import questions from questions.json
function importQuestions() {
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

// Connect to the database and create tables if they don't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT,
    option1 TEXT,
    option2 TEXT,
    option3 TEXT,
    answer INTEGER,
    level INTEGER
  )`);

  // Check if questions have been imported before
  db.get("SELECT COUNT(*) as count FROM questions", (err, row) => {
    if (err) {
      console.error(err);
    } else {
      const rowCount = row.count;
      if (rowCount === 0) {
        // Questions haven't been imported, import them
        importQuestions();
      } else {
        console.log("Questions have already been imported. Skipping import.");
      }
    }
  });
});

// API ROUTES
app.get("/questions", (req, res) => {
  db.all(`SELECT * FROM questions`, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(rows);
    }
  });
});

app.get("/questions/:level", (req, res) => {
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

// START THE SERVER
app.listen(PORT, () => {
  console.log(
    `Claire's awesome food quiz API running on http://localhost:${PORT}`
  );
});
