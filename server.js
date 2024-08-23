const express = require('express');
const http = require('http');
const next = require('next');
const socketIo = require('socket.io');
const { incrementCounter, getCounterValue } = require('./functions/neo4j');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = socketIo(httpServer);

  io.on('connection', async (socket) => {
    console.log('New WebSocket connection');
    const value = await getCounterValue();
    io.emit('counterUpdate', value);

    socket.on('initialize', async () => {
      const value = await getCounterValue();
      socket.emit('counterUpdate', value);
    });


    socket.on('increment', async () => {
      await incrementCounter();
      const value = await getCounterValue();
      io.emit('counterUpdate', value); 
    });

    socket.on('disconnect', () => {
      console.log('WebSocket connection disconnected');
    });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(3000, () => {
    console.log('Server is listening on port 3000');
  });
});
