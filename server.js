const express = require('express');
const http = require('http').createServer(express);
const io = require('socket.io')(http);
const path = require('path');

const app = express();
const port = process.env.PORT || 9000;

// Client
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// API calls
app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

app.listen(port, () => {
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
