const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const io = require("socket.io")(http);
const Room = require("./Room");

const port = process.env.PORT || 9001;

let connections = new Map<string, typeof Room>();

// Serve React client
if (process.env.NODE_ENV === "production") {
  console.log("Running in production");

  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function (_req: any, res: any) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
} else {
  console.log("Running in development");

  app.get("/", (_req: any, res: any) => {
    res.sendFile(__dirname + "/index.html");
  });
}

http.listen(port, () => {
  console.log("listening on *:", port);
});

// Socket IO
io.on("connection", (socket: any) => {
  let currentRoom = "";

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} left room "${currentRoom}"`);
    delete connections.get(currentRoom)?.connectedIds[socket.id];
    io.in(currentRoom).emit("connected ids", connections.get(currentRoom)?.connectedIds[socket.id]);
  });

  socket.on("join room", (room: string) => {
    console.log(`User ${socket.id} joined room "${room}"`);
    currentRoom = room;

    if (!connections.has(room)) {
      connections.set(currentRoom, new Room());
    }
    socket.join(room);
    let connection = connections.get(currentRoom);
    if (!connection) return;

    connection.connectedIds[socket.id] = true;
    io.in(currentRoom).emit("initialize", connection.gameState);
    io.in(currentRoom).emit("connected ids", connection.connectedIds);
  });

  socket.on("send reveal", () => {
    let connection = connections.get(currentRoom);
    if (!connection) return;

    connection.gameState.isRevealed = true;
    io.in(currentRoom).emit("receive reveal", connection.getPoints());
  });

  socket.on("send new round", (answer: number) => {
    let connection = connections.get(currentRoom);
    if (!connection) return;

    connection.gameState.answer = answer;
    connection.gameState.isRevealed = false;
    io.in(currentRoom).emit("receive new round", answer, connection.getNewWords());
  });

  socket.on("send guess", (guess: number) => {
    let connection = connections.get(currentRoom);
    if (!connection) return;

    connection.gameState.guess = guess;
    io.in(currentRoom).emit("receive guess", guess);
  });

  socket.on("increment score", (teamId: number) => {
    let connection = connections.get(currentRoom);
    if (!connection) return;

    connection.incrementScore(teamId);
    io.in(currentRoom).emit("receive score", connection.gameState.teamScores);
  });

  socket.on("decrement score", (teamId: number) => {
    let connection = connections.get(currentRoom);
    if (!connection) return;

    connection.decrementScore(teamId);
    io.in(currentRoom).emit("receive score", connection.gameState.teamScores);
  });
});
