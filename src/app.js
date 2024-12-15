const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('API is running...'));

module.exports = app;
