const app = require('./app');
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const http = require('http'); // For creating an HTTP server
const { initializeWebSocket } = require('./websockets/websocket');

const PORT = process.env.PORT || 3000;

//Middleware
app.use(express.json());
//Database connection
connectDB();

// Create an HTTP server
const server = http.createServer(app);

// Initialize WebSocket on the same server
initializeWebSocket(server);

// Routes
app.use('/api/auth', authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
