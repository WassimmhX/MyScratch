const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(express.json());
app.use(cors()); // Allow requests from React frontend

// Route to read a file by its path
app.post('/read-file', (req, res) => {
    console.log('Request Body:', req.body); // Check incoming data
    const { filePath } = req.body;
  
    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }
  
    const absolutePath = path.resolve(filePath);
    console.log('Resolved Path:', absolutePath);
  
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ error: 'File not found', path: absolutePath });
    }
  
    fs.readFile(absolutePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err.message);
        return res.status(500).json({ error: 'Error reading file', details: err.message });
      }
      res.json({ content: data });
    });
  });
  app.post('/update-file', (req, res) => {
    const { filePath, newContent } = req.body;
  
    if (!filePath || !newContent) {
      return res.status(400).json({ error: 'File path and new content are required' });
    }
  
    const resolvedPath = path.resolve(filePath);
  
    // Check if the file exists
    if (!fs.existsSync(resolvedPath)) {
      return res.status(404).json({ error: 'File not found', path: resolvedPath });
    }
  
    // Write new content to the file
    fs.writeFile(resolvedPath, newContent, 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error writing to file', details: err.message });
      }
      res.json({ message: 'File content updated successfully' });
    });
  });
  app.post('/run-python', (req, res) => {
    const { filePath } = req.body;  // Get the Python file path from the request
  
    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }
  
    // Resolve the file path
    const resolvedPath = path.resolve(filePath);
  
    // Execute the Python file
    exec(`python3 ${resolvedPath}`, (err, stdout, stderr) => {
      if (err) {
        return res.status(500).json({ error: 'Error executing Python script', details: err.message });
      }
  
      if (stderr) {
        return res.status(500).json({ error: 'Python script error', details: stderr });
      }
  
      // Return the output of the Python script
      res.json({ output: stdout });
    });
  });
// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
