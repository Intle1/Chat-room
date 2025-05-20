const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New user connected');
  
  socket.on('join', (username) => {
    socket.username = username;
    io.emit('system message', `${username} has joined the chat`);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', { user: socket.username, message: msg });
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      io.emit('system message', `${socket.username} has left the chat`);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
