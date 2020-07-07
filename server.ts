const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const io = require("socket.io")(http);
const GameUtils = require("./gameUtils");

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
    delete GameUtils.getConnectedIds(connections, currentRoom)[socket.id];
    io.in(currentRoom).emit("connected ids", GameUtils.getConnectedIds(connections, currentRoom));
  });

  socket.on("join room", (room: string) => {
    console.log(`User ${socket.id} joined room "${room}"`);
    currentRoom = room;
    if (!connections.has(room)) {
      connections.set(room, GameUtils.initializeRoom());
    }
    socket.join(room);
    GameUtils.getConnectedIds(connections, currentRoom)[socket.id] = true;
    io.in(currentRoom).emit("initialize", GameUtils.getGameState(connections, currentRoom));
    io.in(currentRoom).emit("connected ids", GameUtils.getConnectedIds(connections, currentRoom));
  });

  socket.on("send reveal", () => {
    GameUtils.getGameState(connections, currentRoom).isRevealed = true;
    const points = GameUtils.getPoints(GameUtils.getGameState(connections, currentRoom));
    io.in(currentRoom).emit("receive reveal", points);
  });

  socket.on("send new round", (answer: number) => {
    GameUtils.getGameState(connections, currentRoom).answer = answer;
    GameUtils.getGameState(connections, currentRoom).isRevealed = false;
    io.in(currentRoom).emit(
      "receive new round",
      answer,
      GameUtils.getNewWords(GameUtils.getGameState(connections, currentRoom))
    );
  });

  socket.on("send guess", (guess: number) => {
    GameUtils.getGameState(connections, currentRoom).guess = guess;
    io.in(currentRoom).emit("receive guess", guess);
  });

  socket.on("increment score", (teamId: number) => {
    GameUtils.getGameState(connections, currentRoom).teamScores[teamId] =
      GameUtils.getGameState(connections, currentRoom).teamScores[teamId] + 1;
    io.in(currentRoom).emit(
      "receive score",
      GameUtils.getGameState(connections, currentRoom).teamScores
    );
  });

  socket.on("decrement score", (teamId: number) => {
    GameUtils.getGameState(connections, currentRoom).teamScores[teamId] = Math.max(
      GameUtils.getGameState(connections, currentRoom).teamScores[teamId] - 1,
      0
    );
    io.in(currentRoom).emit(
      "receive score",
      GameUtils.getGameState(connections, currentRoom).teamScores
    );
  });
});
