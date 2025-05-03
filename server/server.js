"use strict"

// Import packages and modules
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const { errorHandler } = require('./middleware/errorHandler');

// Configure database
connectDB();

// Initialize Express
const app = express();

// Configure environment variables
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client')));

// Routing
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));