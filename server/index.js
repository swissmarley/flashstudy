const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const db = require("./db");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(fileUpload());

// --------------- Utility: Insert or find category, then insert flashcards ---------------
function importCategoriesAndFlashcards(categories) {
  return new Promise((resolve, reject) => {
    const importPromises = categories.map((cat) => {
      return new Promise((resolveCat, rejectCat) => {
        // Check if category already exists
        const checkSql =
          "SELECT id FROM categories WHERE LOWER(categoryName) = LOWER(?)";
        db.get(checkSql, [cat.categoryName], (checkErr, row) => {
          if (checkErr) return rejectCat(checkErr);

          if (row) {
            // Category found
            resolveCat({ categoryId: row.id, flashcards: cat.flashcards });
          } else {
            // Insert new category
            const insertCatSql =
              "INSERT INTO categories (categoryName) VALUES (?)";
            db.run(insertCatSql, [cat.categoryName], function (insertErr) {
              if (insertErr) return rejectCat(insertErr);
              resolveCat({ categoryId: this.lastID, flashcards: cat.flashcards });
            });
          }
        });
      }).then(({ categoryId, flashcards }) => {
        // Insert the flashcards
        return Promise.all(
          flashcards.map((fc) => {
            return new Promise((resolveFc, rejectFc) => {
              const fcSql =
                "INSERT INTO flashcards (categoryId, question, answer) VALUES (?, ?, ?)";
              db.run(fcSql, [categoryId, fc.question, fc.answer], (fcErr) => {
                if (fcErr) return rejectFc(fcErr);
                resolveFc(true);
              });
            });
          })
        );
      });
    });

    Promise.all(importPromises)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
}

// -----------------------------------------
// GET /api/categories
// -----------------------------------------
app.get("/api/categories", (req, res) => {
  const { includeFlashcards } = req.query;

  if (includeFlashcards === "true") {
    const sql = `
      SELECT c.id as categoryId, c.categoryName,
             f.id as flashcardId, f.question, f.answer
      FROM categories c
      LEFT JOIN flashcards f ON c.id = f.categoryId
      ORDER BY c.categoryName ASC
    `;
    db.all(sql, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const categoriesMap = {};
      rows.forEach((row) => {
        if (!categoriesMap[row.categoryId]) {
          categoriesMap[row.categoryId] = {
            categoryId: row.categoryId,
            categoryName: row.categoryName,
            flashcards: [],
          };
        }
        if (row.flashcardId) {
          categoriesMap[row.categoryId].flashcards.push({
            id: row.flashcardId,
            question: row.question,
            answer: row.answer,
          });
        }
      });
      res.json(Object.values(categoriesMap));
    });
  } else {
    const sql = `
      SELECT id as categoryId, categoryName
      FROM categories
      ORDER BY categoryName ASC
    `;
    db.all(sql, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  }
});

// -----------------------------------------
// POST /api/categories
// -----------------------------------------
app.post("/api/categories", (req, res) => {
  const { categoryName } = req.body;
  if (!categoryName) {
    return res.status(400).json({ error: "categoryName is required." });
  }

  const checkSql =
    "SELECT id FROM categories WHERE LOWER(categoryName) = LOWER(?)";
  db.get(checkSql, [categoryName], (checkErr, row) => {
    if (checkErr) {
      return res.status(500).json({ error: checkErr.message });
    }
    if (row) {
      return res.status(400).json({ error: "Category already exists." });
    }

    const sql = "INSERT INTO categories (categoryName) VALUES (?)";
    db.run(sql, [categoryName], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      return res.json({ categoryId: this.lastID, categoryName });
    });
  });
});

// -----------------------------------------
// POST /api/flashcards
// -----------------------------------------
app.post("/api/flashcards", (req, res) => {
  const { categoryId, question, answer } = req.body;
  if (!categoryId || !question || !answer) {
    return res
      .status(400)
      .json({ error: "categoryId, question, and answer are required." });
  }
  const sql =
    "INSERT INTO flashcards (categoryId, question, answer) VALUES (?, ?, ?)";
  db.run(sql, [categoryId, question, answer], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({
      id: this.lastID,
      categoryId,
      question,
      answer,
    });
  });
});

// -----------------------------------------
// POST /api/import (text-based JSON import)
// -----------------------------------------
app.post("/api/import", (req, res) => {
  const { categories } = req.body;
  if (!categories || !Array.isArray(categories)) {
    return res.status(400).json({ error: "Invalid JSON structure. Missing 'categories'." });
  }
  importCategoriesAndFlashcards(categories)
    .then(() => {
      res.json({ success: true, message: "Import complete." });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Error importing data." });
    });
});

// -----------------------------------------
// POST /api/import-file (file-based JSON import)
// -----------------------------------------
app.post("/api/import-file", async (req, res) => {
  if (!req.files || !req.files.jsonFile) {
    return res.status(400).json({ error: "No file uploaded. Field name must be 'jsonFile'." });
  }
  try {
    const fileData = req.files.jsonFile.data.toString("utf8");
    const json = JSON.parse(fileData);

    if (!json.categories || !Array.isArray(json.categories)) {
      return res.status(400).json({ error: "Invalid JSON structure (missing 'categories')." });
    }

    await importCategoriesAndFlashcards(json.categories);
    res.json({ success: true, message: "File import complete." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error parsing or importing file data." });
  }
});

// -----------------------------------------
// POST /api/quiz
//  Body expects: { categoryId, limit }
//  Returns shuffled flashcards
// -----------------------------------------
app.post("/api/quiz", (req, res) => {
  const { categoryId, limit } = req.body;
  if (!categoryId) {
    return res.status(400).json({ error: "categoryId is required." });
  }
  const sql = "SELECT * FROM flashcards WHERE categoryId = ?";
  db.all(sql, [categoryId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows || rows.length === 0) {
      return res.status(400).json({ error: "No flashcards found in category." });
    }
    // Shuffle
    const shuffled = rows.sort(() => 0.5 - Math.random());
    // Limit
    const selected = shuffled.slice(0, limit || 10);
    res.json(selected);
  });
});

// -----------------------------------------
// Start server
// -----------------------------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});