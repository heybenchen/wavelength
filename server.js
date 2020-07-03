const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const io = require("socket.io")(http);
const generateWordList = require("./wordlist");

const port = process.env.PORT || 9001;

let connections = new Map();

function initializeRoom() {
  return {
    connectedIds: {},
    gameState: {
      score: 0,
      guess: 0,
      isRevealed: false,
      remainingWordList: Array.from(generateWordList()),
      wordSet: Array.from(generateWordList())[0],
      teamScores: [0, 0],
    },
  };
}

function getGameState(room) {
  if (connections.has(room)) {
    return connections.get(room).gameState;
  }
}

function getConnectedIds(room) {
  if (connections.has(room)) {
    return connections.get(room).connectedIds;
  }
}

function getPoints(gameState) {
  let modScore = (gameState.score % 360) % 180;
  let normalizedGuess = gameState.guess < 0 ? gameState.guess + 360 : gameState.guess;
  let modGuess = normalizedGuess % 180;
  let separation = Math.ceil(Math.abs(modGuess - modScore) / 2.5);
  console.debug(`Score: ${modScore}, Guess: ${modGuess}, Separation: ${separation}`);
  if (separation > 8) return 0;
  if (separation > 5) return 2;
  if (separation > 2) return 3;
  return 4;
}

function getNewWords(gameState) {
  if (gameState.remainingWordList.length === 0) {
    gameState.remainingWordList = Array.from(generateWordList());
  }
  gameState.wordSet = gameState.remainingWordList.pop();
  return gameState.wordSet;
}

// Client
if (process.env.NODE_ENV === "production") {
  console.log("Running in production");

  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
} else {
  console.log("Running in development");

  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });
}

http.listen(port, () => {
  console.log("listening on *:", port);
});

// Socket IO
io.on("connection", (socket) => {
  let currentRoom = "";

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} left room "${currentRoom}"`);
    delete getConnectedIds(currentRoom)[socket.id];
    io.in(currentRoom).emit("connected ids", getConnectedIds(currentRoom));
  });

  socket.on("join room", (room) => {
    console.log(`User ${socket.id} joined room "${room}"`);
    currentRoom = room;
    if (!connections.has(room)) {
      connections.set(room, initializeRoom());
    }
    socket.join(room);
    getConnectedIds(currentRoom)[socket.id] = true;
    io.in(currentRoom).emit("initialize", getGameState(currentRoom));
    io.in(currentRoom).emit("connected ids", getConnectedIds(currentRoom));
  });

  socket.on("send reveal", () => {
    getGameState(currentRoom).isRevealed = true;
    const points = getPoints(getGameState(currentRoom));
    io.in(currentRoom).emit("receive reveal", points);
  });

  socket.on("send new round", (score) => {
    getGameState(currentRoom).score = score;
    getGameState(currentRoom).isRevealed = false;
    io.in(currentRoom).emit("receive new round", score, getNewWords(getGameState(currentRoom)));
  });

  socket.on("send guess", (guess) => {
    getGameState(currentRoom).guess = guess;
    io.in(currentRoom).emit("receive guess", guess);
  });

  socket.on("increment score", (teamId) => {
    getGameState(currentRoom).teamScores[teamId] = getGameState(currentRoom).teamScores[teamId] + 1;
    io.in(currentRoom).emit("receive score", getGameState(currentRoom).teamScores);
  });

  socket.on("decrement score", (teamId) => {
    getGameState(currentRoom).teamScores[teamId] = Math.max(
      getGameState(currentRoom).teamScores[teamId] - 1,
      0
    );
    io.in(currentRoom).emit("receive score", getGameState(currentRoom).teamScores);
  });
});
