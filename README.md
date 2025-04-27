# TxtExtract: Project Structure & Content Extractor

TxtExtract is a browser-based developer tool designed to effortlessly extract and document the file structure and content of your project directories. Generate a single, formatted output file perfect for sharing, documentation, or providing context to AI models.

**Live Demo:** [https://txtextract.vercel.app](https://txtextract.vercel.app)

## What it Does

Manually copying file structures and contents is time-consuming. TxtExtract uses the **File System Access API** (available in Chromium browsers) to let you select a local project folder. It then reads the directory tree and file contents (respecting your exclusion rules) and compiles everything into one output file. This is incredibly useful for pasting large codebases into AI prompts (like ChatGPT, Claude) without attaching dozens of files.

**Privacy First:** All processing happens **locally in your browser**. Your files and data are never uploaded.

## Key Features

*   **Local Folder Selection:** Securely access local directories via the File System Access API (Chrome/Edge recommended).
*   **Structure & Content Extraction:** Generates a detailed text output with the directory tree and file contents.
*   **Exclusion Controls:**
    *   *Global Filters:* Easily exclude common folders/files (e.g., `.git`, `node_modules`, build output, images) with checkboxes.
    *   *Custom Selection:* Use an interactive file tree to precisely select which files/folders to include or exclude.
*   **Multiple Export Formats:** Download the results as `.txt`, Markdown (`.md`), `.html` (with syntax highlighting), or structured `.json`.
*   **AI Token Optimization:** Reduce the output size significantly for AI prompts by removing extra whitespace, indentation, and simplifying comments, helping you stay within token limits.
*   **Project Statistics:** View file count, total size, lines of code, file type distribution, and estimated token counts before and after optimization.
*   **PowerShell Script Generation:** Create a `.ps1` script to automatically recreate the selected folder structure and file contents on another machine.
*   **Search:** Find text within the generated output preview and filter the custom exclusion file tree.

## How it Works

*   **Frontend:** Built with React for a dynamic user interface.
*   **Core Functionality:** Leverages the browser's native File System Access API to read local directories and files securely.
*   **Token Optimization:** Uses a custom JavaScript tokenizer (`tokenizer.js`) to estimate and reduce token counts based on selected optimization rules.
*   **Export Formatting:** Generates different output formats directly in the browser.