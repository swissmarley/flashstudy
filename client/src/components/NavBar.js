import React from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <header className="bg-gradient-to-r from-indigo-700 to-indigo-500 text-white py-4 px-6 shadow-md">
      <nav className="flex items-center justify-between container mx-auto">
        <h1 className="text-2xl font-bold">Flash Study</h1>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="hover:bg-indigo-600 px-3 py-2 rounded transition"
          >
            Import JSON
          </Link>
          <Link
            to="/manage"
            className="hover:bg-indigo-600 px-3 py-2 rounded transition"
          >
            Manage
          </Link>
          <Link
            to="/quiz"
            className="hover:bg-indigo-600 px-3 py-2 rounded transition"
          >
            Quiz
          </Link>
        </div>
      </nav>
    </header>
  );
}