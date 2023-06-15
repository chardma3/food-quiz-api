const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./questions.db");
const questions = require("./questions.json");

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

  db.close((err) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Questions data imported successfully");
    }
  });
});
