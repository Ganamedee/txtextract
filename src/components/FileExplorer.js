import React, { useState } from "react";
import "./FileExplorer.css";

function FileExplorer() {
  const [fileStructure, setFileStructure] = useState("");
  const [includeGit, setIncludeGit] = useState(false);
  const [includeNodeModules, setIncludeNodeModules] = useState(false);
  const [includePackageLock, setIncludePackageLock] = useState(false);
  const [includeFavicon, setIncludeFavicon] = useState(false);
  const [includeImgFiles, setIncludeImgFiles] = useState(false); // New state for image files
  const [loading, setLoading] = useState(false);
  const [processedFiles, setProcessedFiles] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [error, setError] = useState("");

  // Check if the File System Access API is supported
  const isFileSystemAccessSupported = () => {
    return "showDirectoryPicker" in window;
  };

  // Function to count files in directory (for progress tracking)
  const countFiles = async (dirHandle, options) => {
    let count = 0;

    for await (const [name, handle] of dirHandle) {
      // Skip excluded directories
      if (
        (!options.includeGit && name === ".git") ||
        (!options.includeNodeModules && name === "node_modules")
      ) {
        continue;
      }

      // Skip excluded files
      if (handle.kind === "file") {
        const isImageFile = /\.(jpg|jpeg|png|gif|svg|bmp|webp|ico)$/i.test(name);
        if (
          (!options.includePackageLock && name === "package-lock.json") ||
          (!options.includeFavicon &&
            (name === "favicon.ico" || name.startsWith("favicon."))) ||
          (!options.includeImgFiles && isImageFile)
        ) {
          continue;
        }
      }

      if (handle.kind === "directory") {
        try {
          count += await countFiles(handle, options);
        } catch (error) {
          console.error(`Error counting files in directory ${name}:`, error);
        }
      } else {
        count++;
      }
    }

    return count;
  };

  const handleFolderSelect = async () => {
    // Reset states
    setFileStructure("");
    setError("");
    setProcessedFiles(0);
    setTotalFiles(0);

    try {
      // Check browser compatibility
      if (!isFileSystemAccessSupported()) {
        throw new Error(
          "Your browser does not support the File System Access API. Please use Chrome, Edge, or another Chromium-based browser."
        );
      }

      // Request access to a directory
      const dirHandle = await window.showDirectoryPicker();
      setLoading(true);

      // Count total files for progress tracking
      const options = {
        includeGit,
        includeNodeModules,
        includePackageLock,
        includeFavicon,
        includeImgFiles, // Add new option
      };
      const totalFilesCount = await countFiles(dirHandle, options);
      setTotalFiles(totalFilesCount);

      // Process the directory
      const result = await processDirectory(dirHandle, "", options);

      setFileStructure(result);
    } catch (error) {
      console.error("Error selecting folder:", error);
      setError(
        error.message || "An error occurred while selecting the folder."
      );
    } finally {
      setLoading(false);
    }
  };

  const processDirectory = async (dirHandle, path, options) => {
    let output = "";

    // Iterate through directory entries
    for await (const [name, handle] of dirHandle) {
      const newPath = path ? `${path}/${name}` : name;

      // Skip excluded directories
      if (
        (!options.includeGit && name === ".git") ||
        (!options.includeNodeModules && name === "node_modules")
      ) {
        continue;
      }

      // Skip excluded files
      if (handle.kind === "file") {
        const isImageFile = /\.(jpg|jpeg|png|gif|svg|bmp|webp|ico)$/i.test(name);
        if (
          (!options.includePackageLock && name === "package-lock.json") ||
          (!options.includeFavicon &&
            (name === "favicon.ico" || name.startsWith("favicon."))) ||
          (!options.includeImgFiles && isImageFile)
        ) {
          continue;
        }
      }

      if (handle.kind === "directory") {
        // Add directory name
        output += `\n// Directory: ${newPath}\n`;

        try {
          // Process subdirectory
          const subdirContent = await processDirectory(
            handle,
            newPath,
            options
          );
          output += subdirContent;
        } catch (error) {
          output += `\n// Error accessing directory ${newPath}: ${error.message}\n`;
        }
      } else {
        try {
          // Get file contents
          const file = await handle.getFile();

          // Skip binary files and very large files
          if (file.size > 1024 * 1024) {
            output += `\n// File: ${newPath} (skipped - size: ${(
              file.size / 1024
            ).toFixed(2)} KB)\n`;
          } else {
            try {
              const text = await file.text();

              // Add file path as a comment
              output += `\n// File: ${newPath}\n`;
              output += `${text}\n`;
            } catch (error) {
              output += `\n// File: ${newPath} (error reading content: ${error.message})\n`;
            }
          }

          // Update progress
          setProcessedFiles((prev) => prev + 1);
        } catch (error) {
          output += `\n// Error reading file ${newPath}: ${error.message}\n`;
        }
      }
    }

    return output;
  };

  const handleDownload = () => {
    const blob = new Blob([fileStructure], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "file_structure.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Calculate progress percentage
  const progressPercentage =
    totalFiles > 0 ? Math.round((processedFiles / totalFiles) * 100) : 0;

  return (
    <div className="file-explorer">
      <div className="control-panel">
        <button
          className="select-button"
          onClick={handleFolderSelect}
          disabled={loading}
        >
          {loading ? "Processing..." : "Select Folder"}
        </button>

        <div className="checkbox-container">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={includeGit}
              onChange={() => setIncludeGit(!includeGit)}
              disabled={loading}
            />
            Include .git folders
          </label>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={includeNodeModules}
              onChange={() => setIncludeNodeModules(!includeNodeModules)}
              disabled={loading}
            />
            Include node_modules
          </label>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={includePackageLock}
              onChange={() => setIncludePackageLock(!includePackageLock)}
              disabled={loading}
            />
            Include package-lock.json
          </label>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={includeFavicon}
              onChange={() => setIncludeFavicon(!includeFavicon)}
              disabled={loading}
            />
            Include favicon files
          </label>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={includeImgFiles}
              onChange={() => setIncludeImgFiles(!includeImgFiles)}
              disabled={loading}
            />
            Include image files (.jpg, .png, etc.)
          </label>
        </div>

        {loading && (
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {processedFiles} of {totalFiles} files processed (
              {progressPercentage}%)
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {!isFileSystemAccessSupported() && (
          <div className="browser-warning">
            ⚠️ Your browser may not support the File System Access API. For the
            best experience, please use Chrome, Edge, or another Chromium-based
            browser.
          </div>
        )}
      </div>

      {fileStructure && (
        <div className="result-container">
          <div className="result-header">
            <h2>Extracted File Structure</h2>
            <button className="download-button" onClick={handleDownload}>
              Download as Text File
            </button>
          </div>

          <pre className="output">{fileStructure}</pre>
        </div>
      )}
    </div>
  );
}

export default FileExplorer;