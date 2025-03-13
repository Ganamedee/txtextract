import React, { useState, useEffect } from "react";
import "./App.css";
import FileExplorer from "./components/FileExplorer";

// Theme toggle component
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

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      className="theme-toggle"
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
