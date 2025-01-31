const express = require('express');
const https = require('https');
const { initializeWebSocket } = require('./websockets/websocket');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const apiLimiter = require('./middlewares/rateLimiter');
require('dotenv').config({ path: '../.env' });
const { join } = require('node:path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve static files
app.use(express.static(join(__dirname, 'web-app')));

// Database connection
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
});

// Create an HTTPS server
const key = fs.readFileSync(process.env.SSL_KEY_PATH);
const cert = fs.readFileSync(process.env.SSL_CERT_PATH);

const server = https.createServer({ key, cert }, app);

// Initialize WebSocket on the same server
initializeWebSocket(server);

// Routes
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Failed to start server', err);
});
