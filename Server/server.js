const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

let hostSocketId; // the socket ID of the host

io.on('connection', (socket) => {
  // When a player connects, send them their socket ID
  socket.emit('connect', socket.id);

  // When the host joins the game, save their socket ID
  socket.on('joinAsHost', () => {
    hostSocketId = socket.id;
  });

  // When a player joins the game, send their socket ID to the host
  socket.on('joinAsPlayer', () => {
    if (hostSocketId) {
      io.to(hostSocketId).emit('newPlayer', socket.id);
    }
  });

  // When a player moves, broadcast the move to all players (including the sender)
  socket.on('move', (moveData) => {
    io.emit('move', moveData);
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
