import React, { useState, useEffect } from "react";
import "./App.css";
import FileExplorer from "./components/FileExplorer";

// Theme toggle component with animation
const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return (
      savedTheme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  });

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setIsAnimating(true);
    // The actual theme change happens after the animation starts
    setTimeout(() => {
      setTheme(theme === "light" ? "dark" : "light");
      // Animation will be complete in 500ms
      setTimeout(() => setIsAnimating(false), 500);
    }, 150);
  };

  return (
    <button
      className={`theme-toggle ${isAnimating ? "animating" : ""}`}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1 className="App-title">TxtExtract</h1>
          <p className="App-description">
            Extract file structure and contents from a folder
          </p>
        </div>
        <ThemeToggle />
      </header>
      <main className="App-main">
        <FileExplorer />
      </main>
      <footer className="App-footer">
        <p>
          Powered by{" "}
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vercel
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
