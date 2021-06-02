const express = require('express');
const path = require('path');
const socketIo = require('socket.io');
// servidor de sockets
const http = require('http');
const Sockets = require('./socket');
const cors = require('cors');
// DB
const { dbConnection } = require('../database/config');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    // conectar a DB
    dbConnection();

    // http server
    this.server = http.createServer(this.app);

    // configuración de socket
    this.io = socketIo(this.server, {
      /*configuraciones */
    });

    // inicializar socket
    this.sockets = new Sockets(this.io);
  }

  middlewares() {
    this.app.use(express.static(path.resolve(__dirname, '../public')));

    // cors
    this.app.use(cors());

    // parseo del body
    this.app.use(express.json());

    // API endpoints
    this.app.use('/api/login', require('../router/auth'));
    this.app.use('/api/messages', require('../router/messages'));
  }

  execute() {
    // inicializar middlewares
    this.middlewares();

    // inicializar server
    this.server.listen(this.port, () => {
      console.log(`Server is running on ${this.port}`);
    });
  }
}

module.exports = Server;
