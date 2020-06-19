const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

http.listen(9000, () => {
  console.log('listening on *:9000');
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('connected clients update', io.engine.clientsCount);
  });

  console.log('a user connected');
  io.emit('connected clients update', io.engine.clientsCount);
});
