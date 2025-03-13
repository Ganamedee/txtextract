import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import FileExplorer from "./components/FileExplorer";
import { Analytics } from "@vercel/analytics/react";

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
  const [showAbout, setShowAbout] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [closingAbout, setClosingAbout] = useState(false);
  const [closingFeedback, setClosingFeedback] = useState(false);

  const aboutRef = useRef(null);
  const feedbackRef = useRef(null);

  // Toggle functions for about and feedback panels with animations
  const toggleAbout = () => {
    if (showFeedback) {
      setClosingFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        setClosingFeedback(false);
        setShowAbout(true);
      }, 300); // Match animation duration
    } else if (showAbout) {
      setClosingAbout(true);
      setTimeout(() => {
        setShowAbout(false);
        setClosingAbout(false);
      }, 300); // Match animation duration
    } else {
      setShowAbout(true);
    }
  };

  const toggleFeedback = () => {
    if (showAbout) {
      setClosingAbout(true);
      setTimeout(() => {
        setShowAbout(false);
        setClosingAbout(false);
        setShowFeedback(true);
      }, 300); // Match animation duration
    } else if (showFeedback) {
      setClosingFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        setClosingFeedback(false);
      }, 300); // Match animation duration
    } else {
      setShowFeedback(true);
    }
  };

  // Add a click outside listener to close panels
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showAbout &&
        aboutRef.current &&
        !aboutRef.current.contains(event.target)
      ) {
        toggleAbout();
      }
      if (
        showFeedback &&
        feedbackRef.current &&
        !feedbackRef.current.contains(event.target)
      ) {
        toggleFeedback();
      }
    };

    // Add when panel is open
    if (showAbout || showFeedback) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAbout, showFeedback]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1 className="App-title">TxtExtract</h1>
          <p className="App-description">
            Extract file structure and contents from a folder
          </p>
        </div>
        <div className="top-nav">
          <button
            className="nav-button"
            onClick={toggleAbout}
            aria-label="About"
          >
            About
          </button>
          <button
            className="nav-button"
            onClick={toggleFeedback}
            aria-label="Feedback"
          >
            Feedback
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* About panel with enhanced animation */}
      <div className={`info-panel global-panel ${showAbout ? "show" : ""}`}>
        {(showAbout || closingAbout) && (
          <div
            ref={aboutRef}
            className={`about-panel ${closingAbout ? "closing" : ""}`}
          >
            <h3>About TxtExtract</h3>
            <p>
              TxtExtract helps you extract and document your project's file
              structure and contents. It runs entirely in your browser - no data
              is sent to any server.
            </p>
            <p>
              <strong>Perfect for AI tools:</strong> TxtExtract eliminates the
              need to manually attach multiple files when working with AI
              assistants. Simply extract your project structure, copy the
              result, and paste it into your AI conversation for context.
            </p>
            <p>
              <strong>Features:</strong>
            </p>
            <ul>
              <li>Extract complete file structure and contents</li>
              <li>Control which files and folders to include</li>
              <li>Download in multiple formats (TXT, MD, HTML, JSON)</li>
              <li>Search across all files</li>
              <li>View file statistics and breakdowns</li>
            </ul>
            <button className="close-button" onClick={toggleAbout}>
              Close
            </button>
          </div>
        )}
      </div>

      {/* Feedback panel with enhanced animation */}
      <div className={`info-panel global-panel ${showFeedback ? "show" : ""}`}>
        {(showFeedback || closingFeedback) && (
          <div
            ref={feedbackRef}
            className={`about-panel ${closingFeedback ? "closing" : ""}`}
          >
            <h3>Provide Feedback</h3>
            <p>
              We appreciate your feedback to help improve TxtExtract! If you
              have suggestions or encounter issues, please let us know through
              one of these channels:
            </p>
            <ul>
              <li>
                <strong>GitHub Issues:</strong> Open an issue on our{" "}
                <a
                  href="https://github.com/yourusername/txtextract"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub repository
                </a>
              </li>
              <li>
                <strong>Email:</strong> Send feedback to{" "}
                <a href="mailto:feedback@txtextract.com">
                  feedback@txtextract.com
                </a>
              </li>
              <li>
                <strong>Twitter:</strong> Tweet us{" "}
                <a
                  href="https://twitter.com/txtextract"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @txtextract
                </a>
              </li>
            </ul>
            <button className="close-button" onClick={toggleFeedback}>
              Close
            </button>
          </div>
        )}
      </div>

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

      {/* Add Vercel Analytics */}
      <Analytics />
    </div>
  );
}

export default App;
