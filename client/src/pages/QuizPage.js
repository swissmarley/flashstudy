import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:4000/api";

export default function QuizPage() {
  const [categories, setCategories] = useState([]);
  const [quizCategoryId, setQuizCategoryId] = useState("");
  const [quizNumber, setQuizNumber] = useState(10);
  const [quizMode, setQuizMode] = useState("reveal"); // "reveal" or "type"

  // Quiz states
  const [quizDeck, setQuizDeck] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isQuizzing, setIsQuizzing] = useState(false);

  // For "type" mode
  const [userTypedAnswer, setUserTypedAnswer] = useState("");
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  // Fetch categories on load
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

  // Start quiz
  const startQuiz = async () => {
    if (!quizCategoryId) {
      alert("Please choose a category to start quiz");
      return;
    }
    try {
      const resp = await axios.post(`${BASE_URL}/quiz`, {
        categoryId: quizCategoryId,
        limit: quizNumber,
      });
      if (resp.data?.error) {
        alert(resp.data.error);
        return;
      }
      setQuizDeck(resp.data);
      setQuizIndex(0);
      setShowAnswer(false);
      setCorrectCount(0);
      setIsQuizzing(true);

      // Reset "type mode" states
      setUserTypedAnswer("");
      setIsAnswerChecked(false);
      setIsAnswerCorrect(false);
    } catch (error) {
      alert(error?.response?.data?.error || "Error starting quiz");
    }
  };

  // Reveal mode: "I Got It Right"
  const handleGotItRight = () => {
    const newCount = correctCount + 1;
    // If this is the last card
    if (quizIndex === quizDeck.length - 1) {
      // Show final alert using newCount
      alert(
        `Quiz finished! You got ${newCount} correct answers out of ${quizDeck.length}.`
      );
      setIsQuizzing(false);
      setCorrectCount(newCount);
    } else {
      setCorrectCount(newCount);
      setQuizIndex(quizIndex + 1);
      setShowAnswer(false);
    }
  };

  // Reveal mode: "I Don’t Know"
  const handleIDontKnow = () => {
    // If this is the last card
    if (quizIndex === quizDeck.length - 1) {
      alert(
        `Quiz finished! You got ${correctCount} correct answers out of ${quizDeck.length}.`
      );
      setIsQuizzing(false);
    } else {
      setQuizIndex(quizIndex + 1);
      setShowAnswer(false);
    }
  };

  // Type mode: check typed answer
  const handleCheckAnswer = () => {
    if (!userTypedAnswer.trim()) {
      alert("Please type your answer.");
      return;
    }
    setIsAnswerChecked(true);

    const correctAns = quizDeck[quizIndex].answer.trim().toLowerCase();
    const typed = userTypedAnswer.trim().toLowerCase();

    if (typed === correctAns) {
      setIsAnswerCorrect(true);
      setCorrectCount(correctCount + 1);
    } else {
      setIsAnswerCorrect(false);
    }
  };

  // Move to next card in type mode
  const handleNextTypeCard = () => {
    if (quizIndex === quizDeck.length - 1) {
      alert(
        `Quiz finished! You got ${correctCount} correct answers out of ${quizDeck.length}.`
      );
      setIsQuizzing(false);
      return;
    }
    setQuizIndex(quizIndex + 1);
    setUserTypedAnswer("");
    setIsAnswerChecked(false);
    setIsAnswerCorrect(false);
  };

  return (
    <main className="container mx-auto px-4 py-6">
      {/* IF NOT QUIZZING, SHOW QUIZ SETUP */}
      {!isQuizzing && (
        <section className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Start a Quiz</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Category
            </label>
            <select
              value={quizCategoryId}
              onChange={(e) => setQuizCategoryId(e.target.value)}
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
              Number of Flashcards
            </label>
            <select
              value={quizNumber}
              onChange={(e) => setQuizNumber(Number(e.target.value))}
              className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quiz Mode
            </label>
            <select
              value={quizMode}
              onChange={(e) => setQuizMode(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none"
            >
              <option value="reveal">Reveal/Buttons Mode</option>
              <option value="type">Type-in Answer Mode</option>
            </select>
          </div>

          <button
            onClick={startQuiz}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Start Quiz
          </button>
        </section>
      )}

      {/* IF QUIZZING, SHOW QUIZ UI */}
      {isQuizzing && (
        <section className="mb-8 bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-2xl font-semibold mb-4">Quiz Time!</h2>
          <p className="mb-4">
            Correct Answers:{" "}
            <span className="font-bold text-green-600">
              {correctCount}
            </span>{" "}
            / {quizDeck.length}
          </p>
          <div className="border p-4 rounded mb-4 bg-gradient-to-r from-white to-indigo-50">
            <p className="text-lg font-medium mb-4">
              <span className="bg-indigo-300 text-white py-1 px-2 rounded shadow">Q</span>:{" "}
              {quizDeck[quizIndex]?.question}
            </p>

            {/* REVEAL MODE */}
            {quizMode === "reveal" && (
              <>
                {showAnswer ? (
                  <p className="text-lg text-green-700 mb-4">
                    <span className="bg-green-500 text-white py-1 px-2 rounded shadow">A</span>:{" "}
                    {quizDeck[quizIndex]?.answer}
                  </p>
                ) : (
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="mb-4 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
                  >
                    Show Answer
                  </button>
                )}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleIDontKnow}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    I Don’t Know
                  </button>
                  <button
                    onClick={handleGotItRight}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    I Got It Right
                  </button>
                </div>
              </>
            )}

            {/* TYPE MODE */}
            {quizMode === "type" && (
              <div>
                {!isAnswerChecked ? (
                  <>
                    <input
                      type="text"
                      className="border border-gray-300 p-2 rounded w-full max-w-sm"
                      placeholder="Type your answer..."
                      value={userTypedAnswer}
                      onChange={(e) => setUserTypedAnswer(e.target.value)}
                    />
                    <div className="mt-4">
                      <button
                        onClick={handleCheckAnswer}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Check Answer
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {isAnswerCorrect ? (
                      <p className="text-lg text-green-700 mb-2">Correct!</p>
                    ) : (
                      <p className="text-lg text-red-700 mb-2">
                        Wrong. The correct answer is{" "}
                        <span className="font-semibold">
                          {quizDeck[quizIndex]?.answer}
                        </span>
                      </p>
                    )}
                    <button
                      onClick={handleNextTypeCard}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mt-2"
                    >
                      Next
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}