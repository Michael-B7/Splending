const socket = io();

      socket.on('connect', (socketId) => {
        console.log('Connected with socket ID:', socketId);
      });

      function joinAsHost() {
        socket.emit('joinAsHost');
      }

      function joinAsPlayer() {
        socket.emit('joinAsPlayer');
      }

      socket.on('newPlayer', (playerId) => {
        console.log('New player joined with ID:', playerId);
      });

      function move(moveData) {
        socket.emit('move', moveData);
      }

      socket.on('move', (moveData) => {
        console.log('Received move:', moveData);
      });