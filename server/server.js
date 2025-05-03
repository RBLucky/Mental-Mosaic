"use strict"

// Import packages and modules
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');


// Initialize Express
const app = express();

// Configure environment variables
dotenv.config();
const PORT = process.env.PORT || 5000

// Create path to the parent directory, then to client
const clientPath = path.join(__dirname, '..', 'client');

// File Serving
app.use(express.static('client'));

// Home page route
app.get('/', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
})

// Run the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });