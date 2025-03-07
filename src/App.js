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
