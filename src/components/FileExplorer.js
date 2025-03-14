import React, { useState, useRef, useEffect } from "react";
import "./FileExplorer.css";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

// Icon components for folder tree
const FolderIcon = () => <span className="folder-icon">📁</span>;
const FileIcon = () => <span className="file-icon">📄</span>;
const ChevronRight = () => <span>▶</span>;

// Custom folder tree component for specific file/folder exclusion
const FolderTree = ({
  structure,
  exclusions,
  onToggleExclusion,
  expandedFolders,
  onToggleFolder,
  searchTerm = "",
}) => {
  if (!structure || Object.keys(structure).length === 0) {
    return (
      <div className="folder-tree-empty">No files or folders to display</div>
    );
  }

  // Check if node or any of its children match the search term
  const nodeMatchesSearch = (node, nodeName, path) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const currentPath = path ? `${path}/${nodeName}` : nodeName;

    // Check if current node matches
    if (
      nodeName.toLowerCase().includes(searchLower) ||
      currentPath.toLowerCase().includes(searchLower)
    ) {
      return true;
    }

    // Check if any children match (for directories)
    if (node.type === "directory" && node.children) {
      return Object.entries(node.children).some(([childName, childNode]) =>
        nodeMatchesSearch(childNode, childName, currentPath)
      );
    }

    return false;
  };

  // Auto-expand parents of matching nodes when searching
  useEffect(() => {
    if (searchTerm && onToggleFolder) {
      const pathsToExpand = [];

      const findMatchingPaths = (node, path = "") => {
        if (!node) return;

        Object.entries(node).forEach(([name, item]) => {
          if (!item) return;

          const currentPath = path ? `${path}/${name}` : name;

          if (
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            currentPath.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            // Get all parent paths to expand
            const parentPaths = [];
            let parentPath = "";
            currentPath.split("/").forEach((segment) => {
              if (parentPath) {
                parentPath += "/" + segment;
                parentPaths.push(parentPath);
              } else {
                parentPath = segment;
                parentPaths.push(parentPath);
              }
            });

            // Add parent paths to the expandable array, but not the last segment if it's a file
            if (item.type === "file") {
              if (parentPaths.length > 0) {
                parentPaths.pop();
              }
            }

            pathsToExpand.push(...parentPaths);
          }

          // Recursively check children
          if (item && item.type === "directory" && item.children) {
            findMatchingPaths(item.children, currentPath);
          }
        });
      };

      findMatchingPaths(structure);

      // Add to expanded folders
      if (pathsToExpand.length > 0) {
        // Remove duplicates before adding
        const uniquePaths = [...new Set(pathsToExpand)];
        onToggleFolder("", uniquePaths);
      }
    }
  }, [searchTerm, structure, onToggleFolder]);

  const renderTree = (node, path = "", level = 0) => {
    if (!node) return null;

    return Object.entries(node)
      .filter(([name, item]) => nodeMatchesSearch(item, name, path))
      .map(([name, item]) => {
        const currentPath = path ? `${path}/${name}` : name;
        const isFolder = item.type === "directory";
        const isExpanded = isFolder && expandedFolders.includes(currentPath);
        const isExcluded = exclusions.includes(currentPath);

        // Highlight text if it matches search
        const highlightedName =
          searchTerm &&
          name.toLowerCase().includes(searchTerm.toLowerCase()) ? (
            <span className="highlight-text">{name}</span>
          ) : (
            name
          );

        return (
          <div
            key={currentPath}
            className={
              searchTerm &&
              name.toLowerCase().includes(searchTerm.toLowerCase())
                ? "search-match"
                : ""
            }
          >
            <div
              className={`folder-item ${level > 0 ? "folder-item-indent" : ""}`}
              style={{ paddingLeft: `${level * 0.75}rem` }}
            >
              {isFolder && (
                <span
                  className={`folder-item-toggle ${
                    isExpanded ? "expanded" : ""
                  }`}
                  onClick={() => onToggleFolder(currentPath)}
                >
                  <ChevronRight />
                </span>
              )}
              {isFolder ? <FolderIcon /> : <FileIcon />}
              <span
                className="folder-item-name"
                onClick={() => isFolder && onToggleFolder(currentPath)}
              >
                {highlightedName}
              </span>
              <input
                type="checkbox"
                className="folder-item-checkbox"
                checked={!isExcluded}
                onChange={() => onToggleExclusion(currentPath, isFolder)}
              />
            </div>
            {isFolder && item.children && (
              <div
                className={`folder-item-children ${
                  isExpanded ? "expanded" : "collapsed"
                }`}
              >
                {isExpanded &&
                  renderTree(item.children, currentPath, level + 1)}
              </div>
            )}
          </div>
        );
      });
  };

  return <div className="folder-tree">{renderTree(structure)}</div>;
};

function FileExplorer() {
  const [fileStructure, setFileStructure] = useState("");

  // Exclusion options - expanded with more default folders
  const [includeGit, setIncludeGit] = useState(false);
  const [includeNodeModules, setIncludeNodeModules] = useState(false);
  const [includePackageLock, setIncludePackageLock] = useState(false);
  const [includeFavicon, setIncludeFavicon] = useState(false);
  const [includeImgFiles, setIncludeImgFiles] = useState(false);
  const [includeDSStore, setIncludeDSStore] = useState(false);
  const [includeBuildFolders, setIncludeBuildFolders] = useState(false);
  const [includeDistFolders, setIncludeDistFolders] = useState(false);
  const [includeCoverage, setIncludeCoverage] = useState(false);
  const [includeLogFiles, setIncludeLogFiles] = useState(false);

  // Stats and UI states
  const [showStatistics, setShowStatistics] = useState(false);
  const [hidingStatistics, setHidingStatistics] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buildingFolderStructure, setBuildingFolderStructure] = useState(false);
  const [processedFiles, setProcessedFiles] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [error, setError] = useState("");
  const [exportFormat, setExportFormat] = useState("txt");
  const [folderName, setFolderName] = useState("");
  const [showExclusions, setShowExclusions] = useState(false);

  // Custom folder/file exclusion states
  const [folderStructure, setFolderStructure] = useState({});
  const [customExclusions, setCustomExclusions] = useState([]);
  const [showCustomExclusions, setShowCustomExclusions] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState([]);
  const [selectedDirHandle, setSelectedDirHandle] = useState(null);
  const [folderSearchTerm, setFolderSearchTerm] = useState("");

  const [fileStats, setFileStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    fileTypes: {},
    largestFile: { name: "", size: 0 },
    smallestFile: { name: "", size: Infinity },
    averageFileSize: 0,
    totalLines: 0,
    totalCharacters: 0,
    totalWords: 0,
  });

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);

  // Refs
  const outputRef = useRef(null);
  const exclusionsRef = useRef(null);
  const searchResultRefs = useRef([]);
  const customExclusionsRef = useRef(null);

  // Use effect for exclusion panel animation height calculation
  useEffect(() => {
    if (exclusionsRef.current) {
      if (showExclusions) {
        exclusionsRef.current.style.maxHeight = `${exclusionsRef.current.scrollHeight}px`;
      } else {
        exclusionsRef.current.style.maxHeight = "0";
      }
    }
  }, [showExclusions]);

  // Handle key press for search navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && searchResults.length > 0) {
        // Move to next result when Enter is pressed
        navigateResults("next");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchResults, currentResultIndex]);

  // Handle statistics toggle with proper animation
  const toggleStatistics = () => {
    if (showStatistics) {
      // Immediately set hiding state for animation
      setHidingStatistics(true);
      // Then after animation completes, hide the panel and reset the hiding state
      setTimeout(() => {
        setShowStatistics(false);
        setHidingStatistics(false);
      }, 500); // Match the CSS animation duration (500ms)
    } else {
      // Just show statistics without animation delay
      setShowStatistics(true);
    }
  };

  // Check if the File System Access API is supported
  const isFileSystemAccessSupported = () => {
    return "showDirectoryPicker" in window;
  };

  // Function to count files in directory (for progress tracking)
  const countFiles = async (dirHandle, options) => {
    let count = 0;
    const currentPath = options.currentPath || "";

    try {
      for await (const [name, handle] of dirHandle) {
        // Skip excluded directories
        if (
          (!options.includeGit && name === ".git") ||
          (!options.includeNodeModules && name === "node_modules") ||
          (!options.includeBuildFolders &&
            (name === "build" || name === "out" || name === ".next")) ||
          (!options.includeDistFolders && name === "dist") ||
          (!options.includeCoverage && name === "coverage") ||
          (!options.includeDSStore && name === ".DS_Store")
        ) {
          continue;
        }

        // Skip custom excluded paths
        const newPath = currentPath ? `${currentPath}/${name}` : name;
        if (
          options.customExclusions &&
          options.customExclusions.includes(newPath)
        ) {
          continue;
        }

        // Skip excluded files
        if (handle.kind === "file") {
          const isImageFile = /\.(jpg|jpeg|png|gif|svg|bmp|webp|ico)$/i.test(
            name
          );
          const isLogFile = /\.(log|logs)$/i.test(name);

          if (
            (!options.includePackageLock && name === "package-lock.json") ||
            (!options.includeFavicon &&
              (name === "favicon.ico" || name.startsWith("favicon."))) ||
            (!options.includeImgFiles && isImageFile) ||
            (!options.includeLogFiles && isLogFile)
          ) {
            continue;
          }
        }

        if (handle.kind === "directory") {
          try {
            // Pass the current path to build the full path for children
            const newOptions = { ...options, currentPath: newPath };
            count += await countFiles(handle, newOptions);
          } catch (error) {
            console.error(`Error counting files in directory ${name}:`, error);
          }
        } else {
          count++;
        }
      }
    } catch (error) {
      console.error(`Error iterating through directory:`, error);
    }

    return count;
  };

  // Function to build the directory tree structure, including all folders but marking excluded ones
  const buildDirectoryTree = async (
    dirHandle,
    path,
    options,
    prefix = "",
    isLast = true,
    indent = ""
  ) => {
    let treeOutput = "";
    const entries = [];

    // First, collect all entries WITHOUT filtering out excluded ones
    try {
      for await (const [name, handle] of dirHandle) {
        entries.push({ name, handle });
      }
    } catch (error) {
      console.error(`Error collecting entries from directory:`, error);
      return `${indent}[Error: ${error.message}]\n`;
    }

    // Sort entries: directories first, then files, alphabetically within each group
    entries.sort((a, b) => {
      if (a.handle.kind !== b.handle.kind) {
        return a.handle.kind === "directory" ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    // Process each entry
    for (let i = 0; i < entries.length; i++) {
      const { name, handle } = entries[i];
      const entryIsLast = i === entries.length - 1;
      const newPath = path ? `${path}/${name}` : name;

      // Current line prefix
      const linePrefix = indent + (isLast ? "└── " : "├── ");

      // Next level indent
      const nextIndent = indent + (isLast ? "    " : "│   ");

      // Check if this is excluded by global settings
      const isGloballyExcluded =
        (!options.includeGit && name === ".git") ||
        (!options.includeNodeModules && name === "node_modules") ||
        (!options.includeBuildFolders &&
          (name === "build" || name === "out" || name === ".next")) ||
        (!options.includeDistFolders && name === "dist") ||
        (!options.includeCoverage && name === "coverage") ||
        (!options.includeDSStore && name === ".DS_Store") ||
        (handle.kind === "file" &&
          ((!options.includePackageLock && name === "package-lock.json") ||
            (!options.includeFavicon &&
              (name === "favicon.ico" || name.startsWith("favicon."))) ||
            (!options.includeImgFiles &&
              /\.(jpg|jpeg|png|gif|svg|bmp|webp|ico)$/i.test(name)) ||
            (!options.includeLogFiles && /\.(log|logs)$/i.test(name))));

      // Check if custom excluded
      const isCustomExcluded =
        options.customExclusions && options.customExclusions.includes(newPath);

      // Determine if excluded overall
      const isExcluded = isGloballyExcluded || isCustomExcluded;

      // Always add to tree, but mark excluded items
      if (handle.kind === "directory") {
        if (isExcluded) {
          treeOutput += `${linePrefix}${name}/ [contents not included]\n`;
        } else {
          treeOutput += `${linePrefix}${name}/\n`;
          try {
            const subTree = await buildDirectoryTree(
              handle,
              newPath,
              options,
              prefix + "  ",
              entryIsLast,
              nextIndent
            );
            treeOutput += subTree;
          } catch (error) {
            treeOutput += `${nextIndent}[Error accessing directory: ${error.message}]\n`;
          }
        }
      } else {
        if (isExcluded) {
          treeOutput += `${linePrefix}${name} [not included]\n`;
        } else {
          treeOutput += `${linePrefix}${name}\n`;
        }
      }
    }

    return treeOutput;
  };

  // Helper function to count words in a string
  const countWords = (text) => {
    if (!text) return 0;
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  // Function to collect file statistics
  const collectStatistics = async (dirHandle, path, options) => {
    const stats = {
      totalFiles: 0,
      totalSize: 0,
      fileTypes: {},
      largestFile: { name: "", size: 0 },
      smallestFile: { name: "", size: Infinity },
      totalLines: 0,
      totalCharacters: 0,
      totalWords: 0,
    };

    await processDirectoryStats(dirHandle, path, options, stats);

    // Calculate average file size
    stats.averageFileSize =
      stats.totalFiles > 0 ? stats.totalSize / stats.totalFiles : 0;

    // Sort file types by count
    stats.fileTypes = Object.entries(stats.fileTypes)
      .sort((a, b) => b[1].count - a[1].count)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    return stats;
  };

  // Function to traverse directory and collect stats
  const processDirectoryStats = async (dirHandle, path, options, stats) => {
    try {
      for await (const [name, handle] of dirHandle) {
        const newPath = path ? `${path}/${name}` : name;

        // Skip excluded directories
        if (
          (!options.includeGit && name === ".git") ||
          (!options.includeNodeModules && name === "node_modules") ||
          (!options.includeBuildFolders &&
            (name === "build" || name === "out" || name === ".next")) ||
          (!options.includeDistFolders && name === "dist") ||
          (!options.includeCoverage && name === "coverage") ||
          (!options.includeDSStore && name === ".DS_Store")
        ) {
          continue;
        }

        // Skip custom excluded paths
        if (
          options.customExclusions &&
          options.customExclusions.includes(newPath)
        ) {
          continue;
        }

        if (handle.kind === "directory") {
          try {
            await processDirectoryStats(handle, newPath, options, stats);
          } catch (error) {
            console.error(`Error accessing directory ${newPath}:`, error);
          }
        } else {
          // Skip excluded files
          const isImageFile = /\.(jpg|jpeg|png|gif|svg|bmp|webp|ico)$/i.test(
            name
          );
          const isLogFile = /\.(log|logs)$/i.test(name);

          if (
            (!options.includePackageLock && name === "package-lock.json") ||
            (!options.includeFavicon &&
              (name === "favicon.ico" || name.startsWith("favicon."))) ||
            (!options.includeImgFiles && isImageFile) ||
            (!options.includeLogFiles && isLogFile)
          ) {
            continue;
          }

          try {
            const file = await handle.getFile();

            // Update file stats
            stats.totalFiles++;
            stats.totalSize += file.size;

            // Track largest and smallest files
            if (file.size > stats.largestFile.size) {
              stats.largestFile = { name: newPath, size: file.size };
            }
            if (file.size < stats.smallestFile.size) {
              stats.smallestFile = { name: newPath, size: file.size };
            }

            // Track file types
            const fileExtension =
              name.split(".").pop().toLowerCase() || "unknown";
            if (!stats.fileTypes[fileExtension]) {
              stats.fileTypes[fileExtension] = { count: 0, size: 0 };
            }
            stats.fileTypes[fileExtension].count++;
            stats.fileTypes[fileExtension].size += file.size;

            // Get text content to count lines, characters, and words
            // Only process files under 5MB for text analysis
            if (file.size <= 5 * 1024 * 1024) {
              try {
                const text = await file.text();
                const lines = text.split("\n").length;
                const characters = text.length;
                const words = countWords(text);

                stats.totalLines += lines;
                stats.totalCharacters += characters;
                stats.totalWords += words;
              } catch (error) {
                console.error(
                  `Error reading file content for ${newPath}:`,
                  error
                );
              }
            }
          } catch (error) {
            console.error(`Error reading file ${newPath}:`, error);
          }
        }
      }
    } catch (error) {
      console.error(`Error processing directory stats:`, error);
    }
  };

  // Function to build folder structure for custom exclusion UI
  // FIXED: Now respects global exclusion settings to significantly improve performance
  const buildFolderStructure = async (dirHandle, path = "", options) => {
    const structure = {};

    try {
      // First collect entries to sort them
      const entries = [];

      for await (const [name, handle] of dirHandle) {
        // Skip excluded directories based on global settings
        if (
          (!options.includeGit && name === ".git") ||
          (!options.includeNodeModules && name === "node_modules") ||
          (!options.includeBuildFolders &&
            (name === "build" || name === "out" || name === ".next")) ||
          (!options.includeDistFolders && name === "dist") ||
          (!options.includeCoverage && name === "coverage") ||
          (!options.includeDSStore && name === ".DS_Store")
        ) {
          continue;
        }

        // Skip excluded files based on global settings
        if (handle.kind === "file") {
          const isImageFile = /\.(jpg|jpeg|png|gif|svg|bmp|webp|ico)$/i.test(
            name
          );
          const isLogFile = /\.(log|logs)$/i.test(name);

          if (
            (!options.includePackageLock && name === "package-lock.json") ||
            (!options.includeFavicon &&
              (name === "favicon.ico" || name.startsWith("favicon."))) ||
            (!options.includeImgFiles && isImageFile) ||
            (!options.includeLogFiles && isLogFile)
          ) {
            continue;
          }
        }

        entries.push([name, handle]);
      }

      // Sort entries: directories first, then files, alphabetically
      entries.sort((a, b) => {
        const [nameA, handleA] = a;
        const [nameB, handleB] = b;

        if (handleA.kind !== handleB.kind) {
          return handleA.kind === "directory" ? -1 : 1;
        }
        return nameA.localeCompare(nameB);
      });

      // Process entries
      for (const [name, handle] of entries) {
        const newPath = path ? `${path}/${name}` : name;

        if (handle.kind === "directory") {
          try {
            const children = await buildFolderStructure(
              handle,
              newPath,
              options
            );
            // Only include directory if it has children or if we're at top level
            if (Object.keys(children).length > 0 || path === "") {
              structure[name] = {
                type: "directory",
                children: children,
              };
            }
          } catch (error) {
            console.error(`Error accessing directory ${newPath}:`, error);
            structure[name] = {
              type: "directory",
              children: {},
              error: error.message,
            };
          }
        } else {
          structure[name] = {
            type: "file",
            path: newPath,
          };
        }
      }
    } catch (error) {
      console.error("Error building folder structure:", error);
    }

    return structure;
  };

  // Helper function to escape HTML
  const escapeHtml = (unsafe) => {
    if (!unsafe) return "";
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // UPDATED: Toggle function for custom exclusion with cascade effect
  const toggleCustomExclusion = (path, isFolder) => {
    setCustomExclusions((prev) => {
      // Check if the path is currently excluded
      const isCurrentlyExcluded = prev.includes(path);

      if (isCurrentlyExcluded) {
        // If it's currently excluded, we need to remove it from exclusions
        if (!isFolder) {
          // For files, just remove this specific path
          return prev.filter((item) => item !== path);
        } else {
          // For folders, remove this path and all child paths
          return prev.filter(
            (item) => !item.startsWith(path + "/") && item !== path
          );
        }
      } else {
        // If it's not currently excluded, we need to add it to exclusions
        if (!isFolder) {
          // For files, just add this specific path
          return [...prev, path];
        } else {
          // For folders, add this path and all child paths
          const childPaths = getAllChildPaths(path);
          // Filter out any existing child paths first to prevent duplicates
          const filteredPrev = prev.filter(
            (item) => !childPaths.includes(item) && item !== path
          );
          return [...filteredPrev, path, ...childPaths];
        }
      }
    });
  };

  // Helper function to get all child paths of a folder
  const getAllChildPaths = (folderPath) => {
    const result = [];

    const traverseStructure = (structure, currentPath) => {
      if (!structure) return;

      Object.entries(structure).forEach(([name, item]) => {
        if (!item) return;

        const itemPath = currentPath ? `${currentPath}/${name}` : name;

        // Check if this is under the target folder path
        if (itemPath.startsWith(folderPath + "/")) {
          result.push(itemPath);

          // Recursively process children
          if (item.type === "directory" && item.children) {
            traverseStructure(item.children, itemPath);
          }
        }
      });
    };

    traverseStructure(folderStructure, "");
    return result;
  };

  // Function to toggle folder expansion in the tree view
  const toggleFolder = (path, additionalPaths = null) => {
    setExpandedFolders((prev) => {
      if (additionalPaths && Array.isArray(additionalPaths)) {
        // Add all additional paths, removing duplicates
        const allPaths = [...new Set([...prev, ...additionalPaths])];
        return allPaths;
      }

      if (path && prev.includes(path)) {
        return prev.filter(
          (item) => !item.startsWith(path + "/") && item !== path
        );
      } else if (path) {
        return [...prev, path];
      }

      return prev;
    });
  };

  // Function to select all items
  const selectAllItems = () => {
    setCustomExclusions([]);
  };

  // Function to deselect all items
  const deselectAllItems = () => {
    // Get all paths recursively from the folder structure
    const getAllPaths = (structure, basePath = "") => {
      let paths = [];

      Object.entries(structure).forEach(([name, item]) => {
        if (!item) return;

        const currentPath = basePath ? `${basePath}/${name}` : name;
        paths.push(currentPath);

        if (item.type === "directory" && item.children) {
          paths = [...paths, ...getAllPaths(item.children, currentPath)];
        }
      });

      return paths;
    };

    setCustomExclusions(getAllPaths(folderStructure));
  };

  const handleFolderSelect = async () => {
    // Reset states
    setFileStructure("");
    setError("");
    setProcessedFiles(0);
    setTotalFiles(0);
    setSearchQuery("");
    setSearchResults([]);
    setCurrentResultIndex(-1);
    setCustomExclusions([]);
    setExpandedFolders([]);
    setShowCustomExclusions(false);
    setLoading(true);

    try {
      // Check browser compatibility
      if (!isFileSystemAccessSupported()) {
        throw new Error(
          "Your browser does not support the File System Access API. Please use Chrome, Edge, or another Chromium-based browser."
        );
      }

      // Request access to a directory
      const dirHandle = await window.showDirectoryPicker();
      setSelectedDirHandle(dirHandle);

      // Save folder name for download
      setFolderName(dirHandle.name);

      // Process the folder immediately with default options
      // Count total files for progress tracking
      const options = {
        includeGit,
        includeNodeModules,
        includePackageLock,
        includeFavicon,
        includeImgFiles,
        includeDSStore,
        includeBuildFolders,
        includeDistFolders,
        includeCoverage,
        includeLogFiles,
        customExclusions: [],
      };

      const totalFilesCount = await countFiles(dirHandle, options);
      setTotalFiles(totalFilesCount);

      // Collect statistics
      const stats = await collectStatistics(dirHandle, "", options);
      setFileStats(stats);

      // Process the directory
      const result = await processDirectory(dirHandle, "", options);
      setFileStructure(result);

      // Build folder structure for potential later customization - FIXED: added loading indicator
      setBuildingFolderStructure(true);

      // Build folder structure in a non-blocking way with setTimeout
      setTimeout(async () => {
        try {
          const structure = await buildFolderStructure(dirHandle, "", options);
          setFolderStructure(structure);

          // All folders collapsed by default (changed from root level expansion)
          setExpandedFolders([]);
        } catch (error) {
          console.error("Error building folder structure:", error);
          setError("Error building folder structure: " + error.message);
        } finally {
          setBuildingFolderStructure(false);
        }
      }, 100);
    } catch (error) {
      console.error("Error processing folder:", error);
      setError(
        error.message || "An error occurred while processing the folder."
      );
    } finally {
      setLoading(false);
    }
  };

  // Process the selected folder with custom exclusions
  const processSelectedFolder = async () => {
    if (!selectedDirHandle) {
      setError("Please select a folder first.");
      return;
    }

    setLoading(true);
    setFileStructure("");
    setError("");
    setProcessedFiles(0);
    setTotalFiles(0);
    setShowCustomExclusions(false);

    try {
      // Count total files for progress tracking
      const options = {
        includeGit,
        includeNodeModules,
        includePackageLock,
        includeFavicon,
        includeImgFiles,
        includeDSStore,
        includeBuildFolders,
        includeDistFolders,
        includeCoverage,
        includeLogFiles,
        customExclusions,
      };
      const totalFilesCount = await countFiles(selectedDirHandle, options);
      setTotalFiles(totalFilesCount);

      // Collect statistics
      const stats = await collectStatistics(selectedDirHandle, "", options);
      setFileStats(stats);

      // Process the directory
      const result = await processDirectory(selectedDirHandle, "", options);
      setFileStructure(result);
    } catch (error) {
      console.error("Error processing folder:", error);
      setError(
        error.message || "An error occurred while processing the folder."
      );
    } finally {
      setLoading(false);
    }
  };

  // Updated processDirectory function to include the tree view and escape HTML
  const processDirectory = async (dirHandle, path, options) => {
    let output = "";

    try {
      // First, generate the tree structure for the top of the file
      output += "// Full Directory Structure:\n";
      const treeStructure = await buildDirectoryTree(dirHandle, "", options);
      output += treeStructure;
      output += "\n// Detailed File Contents:\n";

      // Original file content processing logic
      for await (const [name, handle] of dirHandle) {
        const newPath = path ? `${path}/${name}` : name;

        // Skip excluded directories
        if (
          (!options.includeGit && name === ".git") ||
          (!options.includeNodeModules && name === "node_modules") ||
          (!options.includeBuildFolders &&
            (name === "build" || name === "out" || name === ".next")) ||
          (!options.includeDistFolders && name === "dist") ||
          (!options.includeCoverage && name === "coverage") ||
          (!options.includeDSStore && name === ".DS_Store")
        ) {
          continue;
        }

        // Skip custom excluded paths
        if (
          options.customExclusions &&
          options.customExclusions.includes(newPath)
        ) {
          continue;
        }

        // Skip excluded files
        if (handle.kind === "file") {
          const isImageFile = /\.(jpg|jpeg|png|gif|svg|bmp|webp|ico)$/i.test(
            name
          );
          const isLogFile = /\.(log|logs)$/i.test(name);

          if (
            (!options.includePackageLock && name === "package-lock.json") ||
            (!options.includeFavicon &&
              (name === "favicon.ico" || name.startsWith("favicon."))) ||
            (!options.includeImgFiles && isImageFile) ||
            (!options.includeLogFiles && isLogFile)
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

            // Skip very large files (greater than 5MB)
            if (file.size > 5 * 1024 * 1024) {
              output += `\n// File: ${newPath} (skipped - size: ${(
                file.size / 1024
              ).toFixed(2)} KB)\n`;
            } else {
              try {
                const text = await file.text();

                // Escape HTML in file content to prevent rendering
                const escapedText = escapeHtml(text);

                // Add file path as a comment
                output += `\n// File: ${newPath}\n`;
                output += `${escapedText}\n`;
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
    } catch (error) {
      console.error("Error processing directory:", error);
      output += `\n// Error processing directory: ${error.message}\n`;
    }

    return output;
  };

  // Function to toggle custom exclusion panel with smooth animation
  const toggleCustomExclusionsPanel = () => {
    // Clear any previous search
    setFolderSearchTerm("");

    // Toggle the panel
    setShowCustomExclusions((prev) => !prev);

    // Apply animation
    if (customExclusionsRef.current && !showCustomExclusions) {
      // Opening animation
      customExclusionsRef.current.style.maxHeight = "0";
      customExclusionsRef.current.style.opacity = "0";

      setTimeout(() => {
        if (customExclusionsRef.current) {
          customExclusionsRef.current.style.maxHeight = "2000px";
          customExclusionsRef.current.style.opacity = "1";
        }
      }, 50);
    }
  };

  // Search functionality
  const handleSearch = () => {
    if (!searchQuery.trim() || !fileStructure) return;

    const query = searchQuery.toLowerCase();
    const results = [];

    // Find all occurrences of the search query
    let index = fileStructure.toLowerCase().indexOf(query);
    while (index !== -1) {
      results.push(index);
      index = fileStructure.toLowerCase().indexOf(query, index + 1);
    }

    setSearchResults(results);
    setCurrentResultIndex(results.length > 0 ? 0 : -1);

    // Reset search result refs
    searchResultRefs.current = results.map(() => React.createRef());

    // Scroll to the first result if there are any
    if (results.length > 0 && outputRef.current) {
      scrollToResult(0);
    }
  };

  // Function to navigate between search results
  const navigateResults = (direction) => {
    if (searchResults.length === 0) return;

    let newIndex;
    if (direction === "next") {
      newIndex = (currentResultIndex + 1) % searchResults.length;
    } else {
      newIndex =
        (currentResultIndex - 1 + searchResults.length) % searchResults.length;
    }

    setCurrentResultIndex(newIndex);
    scrollToResult(newIndex);
  };

  // FIXED: Improved scrollToResult function for better search navigation
  const scrollToResult = (resultIndex) => {
    if (
      !outputRef.current ||
      resultIndex < 0 ||
      resultIndex >= searchResults.length
    )
      return;

    const currentMark = outputRef.current.querySelector(
      `#search-result-${resultIndex}`
    );

    if (currentMark) {
      // Smooth scroll to the element with proper offset
      currentMark.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      // Fallback to old method if marks aren't found (during initial render)
      const startIndex = searchResults[resultIndex];
      const preText = fileStructure.substring(0, startIndex);
      const lineBreaks = (preText.match(/\n/g) || []).length;
      const lineHeight = 18; // Approximate line height
      const scrollPosition = lineHeight * lineBreaks;

      // Smooth scroll animation
      const scrollTo = (element, to, duration) => {
        if (!element) return;

        const start = element.scrollTop;
        const change = to - start;
        const increment = 20;
        let currentTime = 0;

        const animateScroll = () => {
          currentTime += increment;
          const val = easeInOutQuad(currentTime, start, change, duration);
          element.scrollTop = val;
          if (currentTime < duration) {
            setTimeout(animateScroll, increment);
          }
        };

        animateScroll();
      };

      // Easing function
      const easeInOutQuad = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      };

      // Scroll with animation
      scrollTo(outputRef.current, scrollPosition - 150, 300);
    }
  };

  // Function to highlight search results safely (maintaining HTML escaping)
  const highlightSearchResults = (text, query, results, currentIndex) => {
    if (!query || !results || results.length === 0) return text;

    let highlightedText = "";
    let lastIndex = 0;

    for (let i = 0; i < results.length; i++) {
      const startIndex = results[i];
      const endIndex = startIndex + query.length;

      // Add text before this match
      highlightedText += text.substring(lastIndex, startIndex);

      // Add the highlighted match
      if (i === currentIndex) {
        highlightedText += `<mark class="current-match" id="search-result-${i}">${text.substring(
          startIndex,
          endIndex
        )}</mark>`;
      } else {
        highlightedText += `<mark id="search-result-${i}">${text.substring(
          startIndex,
          endIndex
        )}</mark>`;
      }

      lastIndex = endIndex;
    }

    // Add remaining text
    highlightedText += text.substring(lastIndex);

    return highlightedText;
  };

  // Export functions
  const handleExport = () => {
    switch (exportFormat) {
      case "txt":
        exportAsText();
        break;
      case "md":
        exportAsMarkdown();
        break;
      case "html":
        exportAsHtml();
        break;
      case "json":
        exportAsJson();
        break;
      default:
        exportAsText();
    }
  };

  // Text export with folder name
  const exportAsText = () => {
    const filename = folderName
      ? `${folderName}_structure.txt`
      : "file_structure.txt";
    const blob = new Blob([fileStructure], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Markdown export with folder name
  const exportAsMarkdown = () => {
    const filename = folderName
      ? `${folderName}_structure.md`
      : "file_structure.md";

    // Convert the output to markdown format
    let mdContent = `# ${folderName || "File"} Structure\n\n`;

    // Get the tree structure part
    const treeStructureMatch = fileStructure.match(
      /\/\/ Full Directory Structure:\n([\s\S]*?)\/\/ Detailed File Contents:/
    );
    if (treeStructureMatch && treeStructureMatch[1]) {
      mdContent +=
        "## Directory Tree\n\n```\n" + treeStructureMatch[1] + "```\n\n";
    }

    // Add statistics if available
    if (fileStats.totalFiles > 0) {
      mdContent += "## Statistics\n\n";
      mdContent += `- Total Files: ${fileStats.totalFiles}\n`;
      mdContent += `- Total Size: ${(
        fileStats.totalSize /
        (1024 * 1024)
      ).toFixed(2)} MB\n`;
      mdContent += `- Average File Size: ${(
        fileStats.averageFileSize / 1024
      ).toFixed(2)} KB\n`;
      mdContent += `- Total Lines: ${fileStats.totalLines.toLocaleString()}\n`;
      mdContent += `- Total Characters: ${fileStats.totalCharacters.toLocaleString()}\n`;
      mdContent += `- Total Words: ${fileStats.totalWords.toLocaleString()}\n`;
      mdContent += `- Largest File: ${fileStats.largestFile.name} (${(
        fileStats.largestFile.size / 1024
      ).toFixed(2)} KB)\n\n`;

      mdContent += "### File Types\n\n";
      Object.entries(fileStats.fileTypes)
        .slice(0, 10)
        .forEach(([ext, data]) => {
          mdContent += `- .${ext}: ${data.count} files, ${(
            data.size / 1024
          ).toFixed(1)} KB\n`;
        });
      mdContent += "\n";
    }

    // Get file contents and convert them to markdown
    mdContent += "## File Contents\n\n";

    // Split by file markers
    const fileRegex =
      /\/\/ File: (.*)\n([\s\S]*?)(?=\/\/ File:|\/\/ Directory:|$)/g;
    let match;

    while ((match = fileRegex.exec(fileStructure)) !== null) {
      const filePath = match[1];
      const content = match[2].trim();

      // Add file heading
      mdContent += `### ${filePath}\n\n`;

      // Determine the language for code block based on file extension
      const extension = filePath.split(".").pop().toLowerCase();
      const language = getLanguageFromExtension(extension);

      // Add file content as a code block
      mdContent += "```" + language + "\n" + content + "\n```\n\n";
    }

    // Export the markdown file
    const blob = new Blob([mdContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // HTML export with folder name
  const exportAsHtml = () => {
    const filename = folderName
      ? `${folderName}_structure.html`
      : "file_structure.html";

    // Create a styled HTML document
    let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${folderName || "File"} Structure</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/atom-one-dark.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    pre {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      overflow-x: auto;
    }
    .tree {
      font-family: monospace;
      white-space: pre;
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
    }
    h1 {
      color: #2c3e50;
      padding-bottom: 10px;
      border-bottom: 2px solid #eaecef;
    }
    h2 {
      color: #2c3e50;
      margin-top: 30px;
    }
    h3 {
      color: #2c3e50;
      margin-top: 25px;
      padding: 5px 10px;
      background: #f1f1f1;
      border-radius: 4px;
    }
    .file-container {
      margin-bottom: 30px;
    }
    .file-path {
      font-weight: bold;
      margin-bottom: 10px;
    }
    .directory-path {
      font-weight: bold;
      margin: 20px 0 10px;
      padding: 5px 10px;
      background: #e0f7fa;
      border-radius: 4px;
    }
    .stats-container {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 10px;
    }
    .file-types {
      margin-top: 15px;
    }
    .excluded {
      color: #888;
      font-style: italic;
    }
  </style>
</head>
<body>
  <h1>${folderName || "File"} Structure</h1>
`;

    // Get the tree structure part
    const treeStructureMatch = fileStructure.match(
      /\/\/ Full Directory Structure:\n([\s\S]*?)\/\/ Detailed File Contents:/
    );
    if (treeStructureMatch && treeStructureMatch[1]) {
      const treeStructure = treeStructureMatch[1]
        .replace(
          /\[contents not included\]/g,
          '<span class="excluded">[contents not included]</span>'
        )
        .replace(
          /\[not included\]/g,
          '<span class="excluded">[not included]</span>'
        )
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      htmlContent +=
        "<h2>Directory Tree</h2>\n<div class='tree'>" +
        treeStructure +
        "</div>\n";
    }

    // Add statistics if available
    if (fileStats.totalFiles > 0) {
      htmlContent += `
  <h2>Statistics</h2>
  <div class="stats-container">
    <div class="stats-grid">
      <div>
        <strong>Total Files:</strong> ${fileStats.totalFiles}
      </div>
      <div>
        <strong>Total Size:</strong> ${(
          fileStats.totalSize /
          (1024 * 1024)
        ).toFixed(2)} MB
      </div>
      <div>
        <strong>Average File Size:</strong> ${(
          fileStats.averageFileSize / 1024
        ).toFixed(2)} KB
      </div>
      <div>
        <strong>Total Lines:</strong> ${fileStats.totalLines.toLocaleString()}
      </div>
      <div>
        <strong>Total Characters:</strong> ${fileStats.totalCharacters.toLocaleString()}
      </div>
      <div>
        <strong>Total Words:</strong> ${fileStats.totalWords.toLocaleString()}
      </div>
      <div>
        <strong>Largest File:</strong> ${fileStats.largestFile.name} (${(
        fileStats.largestFile.size / 1024
      ).toFixed(2)} KB)
      </div>
    </div>
    
    <div class="file-types">
      <h3>File Types</h3>
      <ul>
`;

      Object.entries(fileStats.fileTypes)
        .slice(0, 10)
        .forEach(([ext, data]) => {
          htmlContent += `        <li><strong>.${ext}:</strong> ${
            data.count
          } files, ${(data.size / 1024).toFixed(1)} KB</li>\n`;
        });

      htmlContent += `      </ul>
    </div>
  </div>
`;
    }

    // Get file contents and convert them
    htmlContent += "<h2>File Contents</h2>\n";

    // Split by file and directory markers
    const contentRegex =
      /\/\/ (File|Directory): (.*)\n([\s\S]*?)(?=\/\/ (File|Directory):|$)/g;
    let match;

    while ((match = contentRegex.exec(fileStructure)) !== null) {
      const type = match[1]; // File or Directory
      const path = match[2];
      const content = match[3].trim();

      if (type === "File") {
        // Determine the language for highlighting based on file extension
        const extension = path.split(".").pop().toLowerCase();
        const language = getLanguageFromExtension(extension);

        htmlContent += `
  <div class="file-container">
    <h3>${path}</h3>
    <pre><code class="language-${language}">${content}</code></pre>
  </div>
`;
      } else if (type === "Directory") {
        htmlContent += `
  <div class="directory-path">${path}</div>
`;
      }
    }

    // Close the HTML document
    htmlContent += `
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    });
  </script>
</body>
</html>
`;

    // Export the HTML file
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // JSON export with folder name
  const exportAsJson = () => {
    const filename = folderName
      ? `${folderName}_structure.json`
      : "file_structure.json";

    // Parse the file structure into a JSON object
    const jsonStructure = {
      name: folderName || "Unknown Folder",
      tree: {},
      files: {},
      stats: fileStats,
    };

    // Get the tree structure
    const treeStructureMatch = fileStructure.match(
      /\/\/ Full Directory Structure:\n([\s\S]*?)\/\/ Detailed File Contents:/
    );
    if (treeStructureMatch && treeStructureMatch[1]) {
      jsonStructure.treeText = treeStructureMatch[1].trim();
    }

    // Build structured tree and files data
    const fileRegex =
      /\/\/ File: (.*)\n([\s\S]*?)(?=\/\/ File:|\/\/ Directory:|$)/g;
    let match;

    // Find all files and their content
    while ((match = fileRegex.exec(fileStructure)) !== null) {
      const filePath = match[1];
      const content = match[2].trim();

      // Add to files object
      jsonStructure.files[filePath] = {
        path: filePath,
        content: content,
        extension: filePath.split(".").pop().toLowerCase(),
      };

      // Add to tree structure
      const pathParts = filePath.split("/");
      let currentLevel = jsonStructure.tree;

      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        if (i === pathParts.length - 1) {
          // This is a file
          currentLevel[part] = {
            type: "file",
            path: filePath,
          };
        } else {
          // This is a directory
          if (!currentLevel[part]) {
            currentLevel[part] = {
              type: "directory",
              children: {},
            };
          }
          currentLevel = currentLevel[part].children;
        }
      }
    }

    // Export the JSON file
    const blob = new Blob([JSON.stringify(jsonStructure, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper function to determine language for code highlighting
  const getLanguageFromExtension = (extension) => {
    const languageMap = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      html: "html",
      css: "css",
      scss: "scss",
      less: "less",
      json: "json",
      md: "markdown",
      py: "python",
      java: "java",
      c: "c",
      cpp: "cpp",
      cs: "csharp",
      go: "go",
      rb: "ruby",
      php: "php",
      sh: "bash",
      yaml: "yaml",
      yml: "yaml",
      xml: "xml",
      sql: "sql",
      swift: "swift",
      kt: "kotlin",
      rs: "rust",
    };

    return languageMap[extension] || "plaintext";
  };

  // Calculate progress percentage
  const progressPercentage =
    totalFiles > 0 ? Math.round((processedFiles / totalFiles) * 100) : 0;

  // Handle folder search in exclusion panel
  const handleFolderSearch = (e) => {
    setFolderSearchTerm(e.target.value);
  };

  return (
    <div className="file-explorer">
      <div className="control-panel">
        <div className="panel-header">
          <button
            className="select-button"
            onClick={handleFolderSelect}
            disabled={loading}
          >
            {loading ? "Processing..." : "Select Folder"}
          </button>
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

        {/* Toggle button for exclusions */}
        <div className="options-toggle">
          <button
            className={`toggle-button ${showExclusions ? "active" : ""}`}
            onClick={() => setShowExclusions(!showExclusions)}
          >
            <span className="toggle-icon">{showExclusions ? "−" : "+"}</span>
            Global File & Folder Exclusion Options
          </button>
        </div>

        {/* Collapsible exclusion options */}
        <div
          className="exclusion-wrapper"
          ref={exclusionsRef}
          style={{
            maxHeight: showExclusions
              ? `${exclusionsRef.current?.scrollHeight}px`
              : "0",
            overflow: "hidden",
            transition: "max-height 0.3s ease-in-out",
          }}
        >
          <div className="options-section">
            {/* Reorganized inclusion options into collapsible categories */}
            <div className="exclusion-categories">
              {/* System and Hidden Files Category */}
              <div className="exclusion-category">
                <h5>System & Hidden Files</h5>
                <div className="exclusion-options">
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
                      checked={includeDSStore}
                      onChange={() => setIncludeDSStore(!includeDSStore)}
                      disabled={loading}
                    />
                    Include .DS_Store files
                  </label>

                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={includeLogFiles}
                      onChange={() => setIncludeLogFiles(!includeLogFiles)}
                      disabled={loading}
                    />
                    Include log files
                  </label>
                </div>
              </div>

              {/* Build & Dependencies Category */}
              <div className="exclusion-category">
                <h5>Build & Dependencies</h5>
                <div className="exclusion-options">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={includeNodeModules}
                      onChange={() =>
                        setIncludeNodeModules(!includeNodeModules)
                      }
                      disabled={loading}
                    />
                    Include node_modules
                  </label>

                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={includePackageLock}
                      onChange={() =>
                        setIncludePackageLock(!includePackageLock)
                      }
                      disabled={loading}
                    />
                    Include package-lock.json
                  </label>

                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={includeBuildFolders}
                      onChange={() =>
                        setIncludeBuildFolders(!includeBuildFolders)
                      }
                      disabled={loading}
                    />
                    Include build folders
                  </label>

                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={includeDistFolders}
                      onChange={() =>
                        setIncludeDistFolders(!includeDistFolders)
                      }
                      disabled={loading}
                    />
                    Include dist folders
                  </label>

                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={includeCoverage}
                      onChange={() => setIncludeCoverage(!includeCoverage)}
                      disabled={loading}
                    />
                    Include coverage folders
                  </label>
                </div>
              </div>

              {/* Media Files Category */}
              <div className="exclusion-category">
                <h5>Media Files</h5>
                <div className="exclusion-options">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={includeImgFiles}
                      onChange={() => setIncludeImgFiles(!includeImgFiles)}
                      disabled={loading}
                    />
                    Include image files (.jpg, .png, etc.)
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
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customize Files/Folders Button - only show when files have been processed */}
        {fileStructure && !showCustomExclusions && !loading && (
          <div className="customize-button-container">
            <button
              className="customize-button"
              onClick={toggleCustomExclusionsPanel}
            >
              Customize Files/Folders
            </button>
          </div>
        )}

        {/* Custom Files/Folders Exclusion Panel with smooth animation and search */}
        {showCustomExclusions && (
          <div className="custom-exclusion-container" ref={customExclusionsRef}>
            <div className="custom-exclusion-title">
              <span>Select files and folders to include</span>
              <div className="custom-exclusion-actions">
                <button onClick={selectAllItems} className="action-button">
                  Select All
                </button>
                <button onClick={deselectAllItems} className="action-button">
                  Deselect All
                </button>
              </div>
            </div>

            {/* Add search filter for files/folders */}
            <div className="folder-search-container">
              <input
                type="text"
                placeholder="Search files and folders..."
                value={folderSearchTerm}
                onChange={handleFolderSearch}
                className="folder-search-input"
              />
            </div>

            {buildingFolderStructure ? (
              <div className="folder-tree-loading">
                <div className="progress-container">
                  <div className="progress-text">
                    Building folder structure...
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: "100%",
                        animation: "pulse 1.5s infinite",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <FolderTree
                structure={folderStructure}
                exclusions={customExclusions}
                onToggleExclusion={toggleCustomExclusion}
                expandedFolders={expandedFolders}
                onToggleFolder={toggleFolder}
                searchTerm={folderSearchTerm}
              />
            )}

            <div className="custom-exclusion-help">
              Check the boxes to include files/folders, uncheck to exclude them.
            </div>
            <button
              onClick={processSelectedFolder}
              className="update-button"
              disabled={loading || buildingFolderStructure}
            >
              {loading ? "Processing..." : "Update with Selected Files/Folders"}
            </button>
          </div>
        )}

        {!isFileSystemAccessSupported() && (
          <div className="browser-warning">
            ⚠️ Your browser may not support the File System Access API. For the
            best experience, please use Chrome, Edge, or another Chromium-based
            browser.
          </div>
        )}
      </div>

      {fileStats.totalFiles > 0 && !loading && (
        <div className="stats-toggle-container">
          <button
            className={`stats-toggle-button ${
              showStatistics || hidingStatistics ? "active" : ""
            }`}
            onClick={toggleStatistics}
          >
            <span className="toggle-icon">
              {showStatistics || hidingStatistics ? "−" : "+"}
            </span>
            {showStatistics ? "Hide Statistics" : "Show Statistics"}
          </button>
        </div>
      )}

      <div
        className={`stats-container ${showStatistics ? "show" : ""} ${
          hidingStatistics ? "hiding" : ""
        }`}
      >
        <div className="stats-content">
          {fileStats.totalFiles > 0 && !loading && (
            <>
              <h3>Project Statistics</h3>

              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Total Files:</span>
                  <span className="stat-value">
                    {fileStats.totalFiles.toLocaleString()}
                  </span>
                </div>

                <div className="stat-item">
                  <span className="stat-label">Total Size:</span>
                  <span className="stat-value">
                    {(fileStats.totalSize / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>

                <div className="stat-item">
                  <span className="stat-label">Average File Size:</span>
                  <span className="stat-value">
                    {(fileStats.averageFileSize / 1024).toFixed(2)} KB
                  </span>
                </div>

                <div className="stat-item">
                  <span className="stat-label">Total Lines:</span>
                  <span className="stat-value">
                    {fileStats.totalLines.toLocaleString()}
                  </span>
                </div>

                <div className="stat-item">
                  <span className="stat-label">Total Characters:</span>
                  <span className="stat-value">
                    {fileStats.totalCharacters.toLocaleString()}
                  </span>
                </div>

                <div className="stat-item">
                  <span className="stat-label">Total Words:</span>
                  <span className="stat-value">
                    {fileStats.totalWords.toLocaleString()}
                  </span>
                </div>

                <div className="stat-item">
                  <span className="stat-label">Largest File:</span>
                  <span className="stat-value">
                    {fileStats.largestFile.name} (
                    {(fileStats.largestFile.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
              </div>

              <h4>File Types</h4>
              <div className="file-types-grid">
                {Object.entries(fileStats.fileTypes)
                  .slice(0, 10)
                  .map(([ext, data]) => (
                    <div key={ext} className="file-type-item">
                      <div className="file-type-name">.{ext}</div>
                      <div className="file-type-count">{data.count} files</div>
                      <div className="file-type-size">
                        {(data.size / 1024).toFixed(1)} KB
                      </div>
                      <div
                        className="file-type-bar"
                        style={{
                          width: `${Math.min(
                            100,
                            (data.count / fileStats.totalFiles) * 300
                          )}%`,
                          backgroundColor: `hsl(${
                            ext
                              .split("")
                              .reduce(
                                (sum, char) => sum + char.charCodeAt(0),
                                0
                              ) % 360
                          }, 70%, 60%)`,
                        }}
                      ></div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>

      {fileStructure && (
        <div className="result-container">
          <div className="result-header">
            <h2>
              {folderName
                ? `${folderName} Structure`
                : "Extracted File Structure"}
            </h2>

            <div className="search-container">
              <input
                type="text"
                placeholder="Search in files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="search-input"
              />
              <button className="search-button" onClick={handleSearch}>
                Search
              </button>
              {searchResults.length > 0 && (
                <div className="search-navigation">
                  <button onClick={() => navigateResults("prev")}>↑</button>
                  <span>
                    {currentResultIndex + 1} of {searchResults.length}
                  </span>
                  <button onClick={() => navigateResults("next")}>↓</button>
                </div>
              )}
            </div>

            <div className="export-controls">
              <select
                className="format-select"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <option value="txt">Text (.txt)</option>
                <option value="md">Markdown (.md)</option>
                <option value="html">HTML (.html)</option>
                <option value="json">JSON (.json)</option>
              </select>

              <button className="download-button" onClick={handleExport}>
                Download File
              </button>
            </div>
          </div>

          <pre
            className="output"
            ref={outputRef}
            dangerouslySetInnerHTML={{
              __html:
                fileStructure && searchQuery && searchResults.length > 0
                  ? highlightSearchResults(
                      fileStructure,
                      searchQuery,
                      searchResults,
                      currentResultIndex
                    )
                  : fileStructure,
            }}
          ></pre>
        </div>
      )}
    </div>
  );
}

export default FileExplorer;
