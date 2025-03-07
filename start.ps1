# PowerShell script to create TxtExtract project files
# Run this script in the directory where you want to create the project files

# Create directories
New-Item -ItemType Directory -Path "public" -Force
New-Item -ItemType Directory -Path "src" -Force
New-Item -ItemType Directory -Path "src\components" -Force

# Create package.json
$packageJson = @"
{
  "name": "txtextract",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "dev": "react-scripts start",
    "build": "react-scripts build",
    "start": "react-scripts start",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
"@
Set-Content -Path "package.json" -Value $packageJson

# Create public/index.html
$indexHtml = @"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Extract file structure and contents from a folder"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>TxtExtract - Extract File Structure</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
"@
Set-Content -Path "public\index.html" -Value $indexHtml

# Create public/manifest.json
$manifestJson = @"
{
  "short_name": "TxtExtract",
  "name": "TxtExtract - Extract File Structure",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
"@
Set-Content -Path "public\manifest.json" -Value $manifestJson

# Create public/favicon.ico (just creating an empty file)
New-Item -ItemType File -Path "public\favicon.ico" -Force

# Create src/index.js
$srcIndexJs = @"
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
"@
Set-Content -Path "src\index.js" -Value $srcIndexJs

# Create src/index.css
$srcIndexCss = @"
body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  min-height: 100vh;
  color: white;
}

code, pre {
  font-family: 'JetBrains Mono', source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

* {
  box-sizing: border-box;
}
"@
Set-Content -Path "src\index.css" -Value $srcIndexCss

# Create src/App.js
$appJs = @"
import React from 'react';
import './App.css';
import FileExplorer from './components/FileExplorer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">TxtExtract</h1>
        <p className="App-description">Extract file structure and contents from a folder</p>
      </header>
      <main className="App-main">
        <FileExplorer />
      </main>
      <footer className="App-footer">
        <p>Powered by <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">Vercel</a></p>
      </footer>
    </div>
  );
}

export default App;
"@
Set-Content -Path "src\App.js" -Value $appJs

# Create src/App.css
$appCss = @"
.App {
  text-align: center;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.App-header {
  padding: 2rem 1rem;
}

.App-title {
  margin: 0;
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(to right, #ffffff, #e2e8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  text-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.App-description {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.App-main {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 1rem 2rem;
}

.App-footer {
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.App-footer a {
  color: #a5b4fc;
  text-decoration: none;
  transition: color 0.2s ease;
  font-weight: 500;
}

.App-footer a:hover {
  color: white;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .App-title {
    font-size: 2.5rem;
  }
  
  .App-description {
    font-size: 1rem;
  }
}
"@
Set-Content -Path "src\App.css" -Value $appCss

# Create src/components/FileExplorer.js
$fileExplorerJs = @"
import React, { useState } from 'react';
import './FileExplorer.css';

function FileExplorer() {
  const [fileStructure, setFileStructure] = useState('');
  const [includeGit, setIncludeGit] = useState(false);
  const [includeNodeModules, setIncludeNodeModules] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processedFiles, setProcessedFiles] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [error, setError] = useState('');

  // Check if the File System Access API is supported
  const isFileSystemAccessSupported = () => {
    return 'showDirectoryPicker' in window;
  };

  // Function to count files in directory (for progress tracking)
  const countFiles = async (dirHandle, options) => {
    let count = 0;
    
    for await (const [name, handle] of dirHandle) {
      // Skip .git and node_modules if not included
      if ((!options.includeGit && name === '.git') || 
          (!options.includeNodeModules && name === 'node_modules')) {
        continue;
      }
      
      if (handle.kind === 'directory') {
        try {
          count += await countFiles(handle, options);
        } catch (error) {
          console.error(`Error counting files in directory \${name}:`, error);
        }
      } else {
        count++;
      }
    }
    
    return count;
  };

  const handleFolderSelect = async () => {
    // Reset states
    setFileStructure('');
    setError('');
    setProcessedFiles(0);
    setTotalFiles(0);
    
    try {
      // Check browser compatibility
      if (!isFileSystemAccessSupported()) {
        throw new Error('Your browser does not support the File System Access API. Please use Chrome, Edge, or another Chromium-based browser.');
      }

      // Request access to a directory
      const dirHandle = await window.showDirectoryPicker();
      setLoading(true);
      
      // Count total files for progress tracking
      const options = { includeGit, includeNodeModules };
      const totalFilesCount = await countFiles(dirHandle, options);
      setTotalFiles(totalFilesCount);
      
      // Process the directory
      const result = await processDirectory(dirHandle, '', options);
      
      setFileStructure(result);
    } catch (error) {
      console.error('Error selecting folder:', error);
      setError(error.message || 'An error occurred while selecting the folder.');
    } finally {
      setLoading(false);
    }
  };

  const processDirectory = async (dirHandle, path, options) => {
    let output = '';
    
    // Iterate through directory entries
    for await (const [name, handle] of dirHandle) {
      const newPath = path ? `\${path}/\${name}` : name;
      
      // Skip .git and node_modules if not included
      if ((!options.includeGit && name === '.git') || 
          (!options.includeNodeModules && name === 'node_modules')) {
        continue;
      }
      
      if (handle.kind === 'directory') {
        // Add directory name
        output += `\n// Directory: \${newPath}\n`;
        
        try {
          // Process subdirectory
          const subdirContent = await processDirectory(handle, newPath, options);
          output += subdirContent;
        } catch (error) {
          output += `\n// Error accessing directory \${newPath}: \${error.message}\n`;
        }
      } else {
        try {
          // Get file contents
          const file = await handle.getFile();
          
          // Skip binary files and very large files
          if (file.size > 1024 * 1024) {
            output += `\n// File: \${newPath} (skipped - size: \${(file.size / 1024).toFixed(2)} KB)\n`;
          } else {
            try {
              const text = await file.text();
              
              // Add file path as a comment
              output += `\n// File: \${newPath}\n`;
              output += `\${text}\n`;
            } catch (error) {
              output += `\n// File: \${newPath} (error reading content: \${error.message})\n`;
            }
          }
          
          // Update progress
          setProcessedFiles(prev => prev + 1);
        } catch (error) {
          output += `\n// Error reading file \${newPath}: \${error.message}\n`;
        }
      }
    }
    
    return output;
  };

  const handleDownload = () => {
    const blob = new Blob([fileStructure], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'file_structure.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Calculate progress percentage
  const progressPercentage = totalFiles > 0 
    ? Math.round((processedFiles / totalFiles) * 100) 
    : 0;

  return (
    <div className="file-explorer">
      <div className="control-panel">
        <button 
          className="select-button"
          onClick={handleFolderSelect}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Select Folder'}
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
        </div>
        
        {loading && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `\${progressPercentage}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {processedFiles} of {totalFiles} files processed ({progressPercentage}%)
            </div>
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        {!isFileSystemAccessSupported() && (
          <div className="browser-warning">
            ⚠️ Your browser may not support the File System Access API. 
            For the best experience, please use Chrome, Edge, or another Chromium-based browser.
          </div>
        )}
      </div>

      {fileStructure && (
        <div className="result-container">
          <div className="result-header">
            <h2>Extracted File Structure</h2>
            <button
              className="download-button"
              onClick={handleDownload}
            >
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
"@
Set-Content -Path "src\components\FileExplorer.js" -Value $fileExplorerJs

# Create src/components/FileExplorer.css
$fileExplorerCss = @"
.file-explorer {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.control-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.select-button {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-weight: 600;
}

.select-button:hover {
  background: #4338ca;
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
}

.select-button:disabled {
  background: #6366f1;
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.checkbox-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
}

.checkbox {
  display: flex;
  align-items: center;
  font-size: 1rem;
  cursor: pointer;
}

.checkbox input {
  margin-right: 10px;
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4f46e5;
}

.error-message {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  color: #fecaca;
  text-align: center;
  width: 100%;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.browser-warning {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(245, 158, 11, 0.2);
  border-radius: 8px;
  color: #fef3c7;
  text-align: center;
  width: 100%;
  border: 1px solid rgba(245, 158, 11, 0.4);
}

.progress-container {
  width: 100%;
  margin-top: 1.5rem;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #4f46e5;
  transition: width 0.3s ease;
}

.progress-text {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  text-align: center;
  opacity: 0.9;
}

.result-container {
  width: 100%;
  margin-top: 1rem;
  background: white;
  color: #1f2937;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.result-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #111827;
}

.download-button {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-weight: 600;
}

.download-button:hover {
  background: #4338ca;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.output {
  padding: 1.5rem;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  max-height: 600px;
  overflow-y: auto;
  background: #f8f9fa;
  border-radius: 0 0 12px 12px;
  color: #374151;
}

@media (max-width: 768px) {
  .control-panel {
    padding: 1.5rem;
    max-width: 100%;
  }
  
  .select-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
  
  .output {
    font-size: 0.75rem;
  }
  
  .result-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
"@
Set-Content -Path "src\components\FileExplorer.css" -Value $fileExplorerCss

# Create .gitignore
$gitignore = @"
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
"@
Set-Content -Path ".gitignore" -Value $gitignore

# Create vercel.json
$vercelJson = @"
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    }
  ],
  "routes": [
    { "handle": "filesystem" },
    { "src": "/.*", "dest": "/index.html" }
  ]
}
"@
Set-Content -Path "vercel.json" -Value $vercelJson

# Create README.md
$readme = @"
# TxtExtract

A web application that extracts and displays file structure and contents.

## Features

- Select a folder using the browser's File System Access API
- Option to include/exclude .git folders and node_modules
- View the complete file structure with contents
- Download the output as a text file

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment on Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

## Browser Compatibility

This application uses the File System Access API, which is only supported in:
- Google Chrome (version 86+)
- Microsoft Edge (version 86+)
- Opera (version 72+)

Other browsers like Firefox and Safari do not currently support this API.

## Notes

- Large files (>1MB) are skipped to prevent browser performance issues
- The application runs entirely in the browser - no data is sent to any server
"@
Set-Content -Path "README.md" -Value $readme

Write-Host "TxtExtract project files have been created successfully!" -ForegroundColor Green
Write-Host "To get started:" -ForegroundColor Yellow
Write-Host "1. Install dependencies: npm install" -ForegroundColor White
Write-Host "2. Start the development server: npm run dev" -ForegroundColor White
Write-Host "3. Deploy to Vercel: vercel" -ForegroundColor White