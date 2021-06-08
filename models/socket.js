const { userConnected, userDisconnected, getUsers } = require('../controllers/socket');
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

      // TODO validar el JWT, si el token no es valido, desconectar
      // TODO saber que usuario esta activo mediante el UID
      // emitir todos los usuarios conectados
      this.io.emit('users-list', await getUsers());
      // TODO socket join
      // TODO  escuchar cuando el cliente manda un mensaje, mensaje personal
      socket.on('personal-message', (payload) => {
        console.log(payload);
      });
      // TODO  disconnect, marcar en el DB que el usuario se desconecto
      // TODO  emitir todos los usuarios conectados

      socket.on('disconnect', async () => {
        console.log('Client disconnected');
        await userDisconnected(uid);
        this.io.emit('users-list', await getUsers());
      });
    });
  }
}

module.exports = Sockets;
