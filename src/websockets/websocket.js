const { Server } = require('socket.io');

let io;

const initializeWebSocket = (server) => {
  // Initialize Socket.IO server
  io = new Server(server, {
    cors: {
      origin: '*', // Allow all origins, update as per your requirements
    },
  });

  console.log('WebSocket server initialized');

  // Listen for client connections
  io.on('connection', (socket) => {
    const token = socket.handshake.auth.token;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // Attach user info to the socket object
      console.log(`User authenticated: ${decoded.id}`);
    } catch (err) {
      console.error('WebSocket authentication failed');
      socket.disconnect();
    }
    console.log(`Client connected: ${socket.id}`);

    // Handle messages sent by clients
    socket.on('send_message', (data) => {
      console.log('Message received:', data);
      // Broadcast the message to all connected clients
      socket.broadcast.emit('receive_message', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    //For websocket test
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
      io.emit('chat message', msg);
    });
  });
};

// Function to get the WebSocket instance elsewhere in the app
const getIO = () => {
  if (!io) {
    throw new Error('WebSocket server is not initialized');
  }
  return io;
};

module.exports = { initializeWebSocket, getIO };
