const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const io = require("socket.io")(http);

const port = process.env.PORT || 9001;

const connectedIds = {};
const gameState = {
  score: 0,
  guess: 0,
  isRevealed: false,
};

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

// API calls
app.get("/api/hello", (req, res) => {
  res.send({ express: "Hello From Express" });
});

app.post("/api/world", (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`
  );
});

http.listen(port, () => {
  console.log("listening on *:", port);
});

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
    io.emit("receive reveal");
  });

  socket.on("send new round", (score) => {
    gameState.score = score;
    gameState.isRevealed = false;
    io.emit("receive new round", score);
  })

  socket.on("send guess", (guess) => {
    gameState.guess = guess;
    io.emit("receive guess", guess);
  });
});
