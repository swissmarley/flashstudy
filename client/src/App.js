import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import ImportPage from "./pages/ImportPage";
import ManagePage from "./pages/ManagePage";
import QuizPage from "./pages/QuizPage";

function App() {
  return (
    <Router>
      {/* NAVBAR (common across all pages) */}
      <NavBar />

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<ImportPage />} />
        <Route path="/manage" element={<ManagePage />} />
        <Route path="/quiz" element={<QuizPage />} />
      </Routes>
    </Router>
  );
}

export default App;