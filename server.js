const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const io = require("socket.io")(http);
const wordList = require("./wordlist");

const port = process.env.PORT || 9001;

let connectedIds = {};
let: gameState = {
  score: 0,
  guess: 0,
  isRevealed: false,
  remainingWordList: Array.from(wordList),
  wordSet: Array.from(wordList)[0],
  teamScores: [0, 0],
};

function getPoints() {
  let modScore = (gameState.score % 360) % 180;
  let normalizedGuess = gameState.guess < 0 ? gameState.guess + 360 : gameState.guess;
  let modGuess = normalizedGuess % 180;
  let separation = Math.ceil(Math.abs(modGuess - modScore) / 2.5);
  console.log(modScore, modGuess, separation);
  if (separation > 8) return 0;
  if (separation > 5) return 2;
  if (separation > 2) return 3;
  return 4;
}

function getNewWords() {
  if (gameState.remainingWordList.length === 0) {
    gameState.remainingWordList = Array.from(wordList);
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
  console.log("a user connected: ", socket.id);
  connectedIds[socket.id] = true;
  io.emit("connected ids", connectedIds);
  io.emit("initialize", gameState);

  socket.on("disconnect", () => {
    console.log("user disconnected: ", socket.id);
    delete connectedIds[socket.id];
    io.emit("connected ids", connectedIds);
  });

  socket.on("send reveal", () => {
    gameState.isRevealed = true;
    io.emit("receive reveal", getPoints());
  });

  socket.on("send new round", (score) => {
    gameState.score = score;
    gameState.isRevealed = false;
    io.emit("receive new round", score, getNewWords());
  });

  socket.on("send guess", (guess) => {
    gameState.guess = guess;
    io.emit("receive guess", guess);
  });

  socket.on("increment score", (teamId) => {
    gameState.teamScores[teamId] = gameState.teamScores[teamId] + 1;
    io.emit("receive score", gameState.teamScores);
  });

  socket.on("decrement score", (teamId) => {
    gameState.teamScores[teamId] = Math.max(gameState.teamScores[teamId] - 1, 0);
    io.emit("receive score", gameState.teamScores);
  });
});
