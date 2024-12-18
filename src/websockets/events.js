const handleSendMessage = (socket, io) => {
    socket.on('send_message', (data) => {
      console.log('Message received:', data);
      io.emit('receive_message', data); // Broadcast message to all clients
    });
  };
  
  const handleDisconnection = (socket) => {
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  };
  
  module.exports = { handleSendMessage, handleDisconnection };
  