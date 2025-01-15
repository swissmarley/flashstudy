import React, { useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:4000/api";

export default function ImportPage() {
  const [importJsonText, setImportJsonText] = useState("");

  // Handle text-based import
  const handleImportJsonText = async () => {
    try {
      const parsed = JSON.parse(importJsonText);
      const resp = await axios.post(`${BASE_URL}/import`, parsed);
      if (resp.data.error) {
        alert(resp.data.error);
        return;
      }
      alert("Import successful (text-based)!");
      setImportJsonText("");
    } catch (err) {
      alert("Invalid JSON or error in importing data.");
      console.error(err);
    }
  };

  // Handle file-based import
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("jsonFile", file);

    try {
      const resp = await axios.post(`${BASE_URL}/import-file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (resp.data.error) {
        alert(resp.data.error);
      } else {
        alert("File import successful!");
      }
    } catch (err) {
      alert("Error uploading or importing file.");
      console.error(err);
    }
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <section className="mb-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Import from JSON (Text-Based)</h2>
        <textarea
          className="w-full h-32 border border-gray-300 rounded p-2 mb-2 text-sm"
          placeholder={`{\n  "categories": [\n    {\n      "categoryName": "Example",\n      "flashcards": [\n        {"question":"Q1","answer":"A1"}\n      ]\n    }\n  ]\n}`}
          value={importJsonText}
          onChange={(e) => setImportJsonText(e.target.value)}
        />
        <br />
        <button
          onClick={handleImportJsonText}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Import JSON (Text)
        </button>
      </section>

      <section className="mb-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Import from JSON (File-Based)</h2>
        <p className="text-sm text-gray-600 mb-4">
          Select a <strong>.json</strong> file:
        </p>
        <input type="file" accept=".json" onChange={handleFileUpload} />
      </section>
    </main>
  );
}