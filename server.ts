import express from "express";
import path from "path";
import Room from "./Room";

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const port = process.env.PORT || 9001;

let connections = new Map<string, Room>();

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
io.on("connection", (socket: SocketIO.Socket) => {
  let currentRoom = "";

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} left room "${currentRoom}"`);

    let connection = connections.get(currentRoom);
    if (!connection) return;
    connection.removePlayer(socket);

    io.in(currentRoom).emit("connected ids", connection.sockets);
  });

  socket.on("join room", (room: string, name: string, teamId: number) => {
    console.log(`Socket ${socket.id} joined room "${room}" with name "${name}" on team ${teamId}`);
    currentRoom = room;

    if (!connections.has(room)) {
      connections.set(currentRoom, new Room());
    }
    socket.join(room);
    let connection = connections.get(currentRoom);
    if (!connection) return;

    connection.addPlayer(socket, name, teamId);
    io.in(currentRoom).emit("initialize", connection.gameState);
    io.in(currentRoom).emit("connected ids", connection.sockets);
  });

  socket.on("send reveal", () => {
    let connection = connections.get(currentRoom);
    if (!connection) return;

    connection.gameState.isRevealed = true;
    io.in(currentRoom).emit("receive reveal", connection.calculatePoints());
  });

  socket.on("send new round", (answer: number) => {
    let connection = connections.get(currentRoom);
    if (!connection) return;

    connection.gameState.answer = answer;
    connection.gameState.isRevealed = false;
    io.in(currentRoom).emit("receive new round", answer, connection.generateNewWords());
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
