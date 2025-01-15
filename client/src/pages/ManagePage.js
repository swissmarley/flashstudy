import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:4000/api";

export default function ManagePage() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const fetchCategories = async () => {
    try {
      const resp = await axios.get(`${BASE_URL}/categories`);
      setCategories(resp.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add Category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Category name cannot be empty");
      return;
    }
    try {
      await axios.post(`${BASE_URL}/categories`, { categoryName: newCategoryName });
      setNewCategoryName("");
      fetchCategories();
    } catch (error) {
      alert(error?.response?.data?.error || "Error adding category");
    }
  };

  // Add Flashcard
  const handleAddFlashcard = async () => {
    if (!selectedCategoryId) {
      alert("Select a category first");
      return;
    }
    if (!question.trim() || !answer.trim()) {
      alert("Question and answer cannot be empty");
      return;
    }
    try {
      await axios.post(`${BASE_URL}/flashcards`, {
        categoryId: selectedCategoryId,
        question,
        answer,
      });
      setQuestion("");
      setAnswer("");
      fetchCategories();
    } catch (error) {
      alert(error?.response?.data?.error || "Error adding flashcard");
    }
  };

  return (
    <main className="container mx-auto px-4 py-6">
      {/* ADD CATEGORY */}
      <section className="mb-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Add Category</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Category name..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none"
          />
          <button
            onClick={handleAddCategory}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>
      </section>

      {/* ADD FLASHCARD */}
      <section className="mb-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Add Flashcard</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Category
          </label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none"
          >
            <option value="">--Select--</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question
          </label>
          <input
            type="text"
            placeholder="Enter Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Answer
          </label>
          <input
            type="text"
            placeholder="Enter Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none"
          />
        </div>

        <button
          onClick={handleAddFlashcard}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Flashcard
        </button>
      </section>
    </main>
  );
}