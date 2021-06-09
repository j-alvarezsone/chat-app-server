const { userConnected, userDisconnected, getUsers, SaveMessage } = require('../controllers/socket');
const { verifyJWT } = require('../helpers/jwt');

class Sockets {
  constructor(io) {
    this.io = io;

    this.socketEvents();
  }

  socketEvents() {
    // on connection
    this.io.on('connection', async (socket) => {
      const [valid, uid] = verifyJWT(socket.handshake.query['x-token']);

      if (!valid) {
        console.log('Unidentified socket');

        return socket.disconnect();
      }

      await userConnected(uid);

      // Unir al usuario a una sala de socket.io
      socket.join(uid);

      // emitir todos los usuarios conectados
      this.io.emit('users-list', await getUsers());

      // escuchar cuando el cliente manda un mensaje, mensaje personal
      socket.on('personal-message', async (payload) => {
        const message = await SaveMessage(payload);
        this.io.to(payload.to).emit('personal-message', message);
        this.io.to(payload.from).emit('personal-message', message);
      });

      socket.on('disconnect', async () => {
        // disconnect, marcar en el DB que el usuario se desconecto
        await userDisconnected(uid);
        this.io.emit('users-list', await getUsers());
      });
    });
  }
}

module.exports = Sockets;
