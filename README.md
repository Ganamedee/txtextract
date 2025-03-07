# TxtExtract

A web application that extracts and displays file structure and contents.

## Features

- Select a folder using the browser's File System Access API
- Option to include/exclude .git folders and node_modules
- View the complete file structure with contents
- Download the output as a text file

## Getting Started

1. Install dependencies:
   `ash
   npm install
   `

2. Start the development server:
   `ash
   npm run dev
   `

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment on Vercel

1. Install Vercel CLI:
   `ash
   npm install -g vercel
   `

2. Deploy:
   `ash
   vercel
   `

## Browser Compatibility

This application uses the File System Access API, which is only supported in:
- Google Chrome (version 86+)
- Microsoft Edge (version 86+)
- Opera (version 72+)

Other browsers like Firefox and Safari do not currently support this API.

## Notes

- Large files (>1MB) are skipped to prevent browser performance issues
- The application runs entirely in the browser - no data is sent to any server
