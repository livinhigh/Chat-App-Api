const express = require('express');
const http = require('http');
const { initializeWebSocket } = require('./websockets/websocket');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config({ path: '../.env' });
const { join } = require('node:path');

const app = express();
const PORT = process.env.PORT || 3000;

//This is a temporary code for testing websockets
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'websockets/websocketTest.html'));
});


// Middleware
app.use(express.json());

// Database connection
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
});

// Create an HTTP server
const server = http.createServer(app);

// Initialize WebSocket on the same server
initializeWebSocket(server);

// Routes
app.use('/api/auth', authRoutes);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Failed to start server', err);
});
