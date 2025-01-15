const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Create or open the database file
const dbPath = path.resolve(__dirname, "flashcards.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Initialize tables if they do not exist
db.serialize(() => {
  // Categories Table
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoryName TEXT NOT NULL
    )
  `);

  // Flashcards Table
  db.run(`
    CREATE TABLE IF NOT EXISTS flashcards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoryId INTEGER NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      FOREIGN KEY (categoryId) REFERENCES categories(id)
    )
  `);
});

module.exports = db;