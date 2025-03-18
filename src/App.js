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
  const [showAiInfo, setShowAiInfo] = useState(false);
  const [closingAbout, setClosingAbout] = useState(false);
  const [closingFeedback, setClosingFeedback] = useState(false);
  const [closingAiInfo, setClosingAiInfo] = useState(false);

  const aboutRef = useRef(null);
  const feedbackRef = useRef(null);
  const aiInfoRef = useRef(null);

  // Improved toggle functions for about and feedback panels with proper animations
  const toggleAbout = () => {
    if (showFeedback || showAiInfo) {
      // First close feedback/AI info then open about
      if (showFeedback) {
        setClosingFeedback(true);
        setTimeout(() => {
          setShowFeedback(false);
          setClosingFeedback(false);
          setShowAbout(true);
        }, 300); // Match animation duration
      } else {
        setClosingAiInfo(true);
        setTimeout(() => {
          setShowAiInfo(false);
          setClosingAiInfo(false);
          setShowAbout(true);
        }, 300); // Match animation duration
      }
    } else if (showAbout) {
      // Close the about panel with animation
      setClosingAbout(true);
      setTimeout(() => {
        setShowAbout(false);
        setClosingAbout(false);
      }, 300); // Match animation duration
    } else {
      // Open the about panel
      setShowAbout(true);
      setClosingAbout(false);
    }
  };

  const toggleFeedback = () => {
    if (showAbout || showAiInfo) {
      // First close about/AI info then open feedback
      if (showAbout) {
        setClosingAbout(true);
        setTimeout(() => {
          setShowAbout(false);
          setClosingAbout(false);
          setShowFeedback(true);
        }, 300); // Match animation duration
      } else {
        setClosingAiInfo(true);
        setTimeout(() => {
          setShowAiInfo(false);
          setClosingAiInfo(false);
          setShowFeedback(true);
        }, 300); // Match animation duration
      }
    } else if (showFeedback) {
      // Close the feedback panel with animation
      setClosingFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        setClosingFeedback(false);
      }, 300); // Match animation duration
    } else {
      // Open the feedback panel
      setShowFeedback(true);
      setClosingFeedback(false);
    }
  };

  // New toggle function for AI info panel
  const toggleAiInfo = () => {
    if (showAbout || showFeedback) {
      // First close about/feedback then open AI info
      if (showAbout) {
        setClosingAbout(true);
        setTimeout(() => {
          setShowAbout(false);
          setClosingAbout(false);
          setShowAiInfo(true);
        }, 300); // Match animation duration
      } else {
        setClosingFeedback(true);
        setTimeout(() => {
          setShowFeedback(false);
          setClosingFeedback(false);
          setShowAiInfo(true);
        }, 300); // Match animation duration
      }
    } else if (showAiInfo) {
      // Close the AI info panel with animation
      setClosingAiInfo(true);
      setTimeout(() => {
        setShowAiInfo(false);
        setClosingAiInfo(false);
      }, 300); // Match animation duration
    } else {
      // Open the AI info panel
      setShowAiInfo(true);
      setClosingAiInfo(false);
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
      if (
        showAiInfo &&
        aiInfoRef.current &&
        !aiInfoRef.current.contains(event.target)
      ) {
        toggleAiInfo();
      }
    };

    // Add when panel is open
    if (showAbout || showFeedback || showAiInfo) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAbout, showFeedback, showAiInfo]);

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
          <button
            className="nav-button"
            onClick={toggleAiInfo}
            aria-label="AI Tokens"
          >
            AI Tokens
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* About panel with improved animation */}
      <div
        className={`info-panel global-panel ${showAbout ? "show" : ""} ${
          closingAbout ? "closing" : ""
        }`}
      >
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
              <li>Token estimation and optimization for AI tools</li>
            </ul>
            <button className="close-button" onClick={toggleAbout}>
              Close
            </button>
          </div>
        )}
      </div>

      {/* Feedback panel with improved animation */}
      <div
        className={`info-panel global-panel ${showFeedback ? "show" : ""} ${
          closingFeedback ? "closing" : ""
        }`}
      >
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

      {/* New AI Info panel */}
      <div
        className={`info-panel global-panel ${showAiInfo ? "show" : ""} ${
          closingAiInfo ? "closing" : ""
        }`}
      >
        {(showAiInfo || closingAiInfo) && (
          <div
            ref={aiInfoRef}
            className={`about-panel ${closingAiInfo ? "closing" : ""}`}
          >
            <h3>AI Token Information</h3>
            <p>
              TxtExtract now includes token counting and optimization features
              designed specifically for use with AI tools like ChatGPT, Claude,
              and others.
            </p>

            <h4>What are tokens?</h4>
            <p>
              Tokens are the basic units that AI models process text with. A
              token can be as short as one character or as long as one word. In
              English, one token is approximately 4 characters or 0.75 words.
            </p>

            <h4>Token limits for popular AI models:</h4>
            <ul>
              <li>
                <strong>GPT-3.5 Turbo:</strong> 16,385 tokens
              </li>
              <li>
                <strong>GPT-4:</strong> 8,192 tokens per request
              </li>
              <li>
                <strong>GPT-4-32k:</strong> 32,768 tokens
              </li>
              <li>
                <strong>Claude 2:</strong> 100,000 tokens
              </li>
              <li>
                <strong>Claude Instant:</strong> 100,000 tokens
              </li>
              <li>
                <strong>Gemini Pro:</strong> 32,768 tokens
              </li>
            </ul>

            <h4>Token Optimization Features:</h4>
            <p>
              TxtExtract can significantly reduce the number of tokens in your
              file structure:
            </p>
            <ul>
              <li>
                <strong>Remove extra whitespace:</strong> Consolidates multiple
                spaces into single spaces
              </li>
              <li>
                <strong>Reduce consecutive newlines:</strong> Limits multiple
                blank lines
              </li>
              <li>
                <strong>Remove indentation:</strong> Eliminates leading
                whitespace in each line
              </li>
              <li>
                <strong>Simplify comment headers:</strong> Shortens comment
                headers in the output
              </li>
              <li>
                <strong>Remove empty lines:</strong> Removes lines that contain
                only whitespace
              </li>
            </ul>

            <p>
              These optimizations can typically reduce token counts by 15-30%
              while maintaining readability for AI models. The token count
              estimate is visible in the Statistics panel.
            </p>

            <button className="close-button" onClick={toggleAiInfo}>
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
