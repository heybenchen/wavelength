const generateWordList = require("./wordlist");

//TODO: Refactor this into a class that can manage its own state

type Room = {
  connectedIds: string[];
  gameState: GameState;
};

type GameState = {
  answer: number;
  guess: number;
  isRevealed: boolean;
  remainingWordList: string[][];
  wordSet: string[] | undefined;
  teamScores: number[];
};

module.exports = {
  initializeRoom() {
    return {
      connectedIds: {},
      gameState: {
        answer: 0,
        guess: 0,
        isRevealed: false,
        remainingWordList: Array.from(generateWordList()),
        wordSet: Array.from(generateWordList())[0],
        teamScores: [0, 0],
      },
    };
  },

  getGameState(connections: Map<string, Room>, room: string) {
    let connectedRoom = connections.get(room);
    return connectedRoom && connectedRoom.gameState;
  },

  getConnectedIds(connections: Map<string, Room>, room: string) {
    let connectedRoom = connections.get(room);
    return connectedRoom && connectedRoom.connectedIds;
  },

  getPoints(gameState: GameState) {
    let modAnswer = (gameState.answer % 360) % 180;
    let normalizedGuess = gameState.guess < 0 ? gameState.guess + 360 : gameState.guess;
    let modGuess = normalizedGuess % 180;
    let separation = Math.ceil(Math.abs(modGuess - modAnswer) / 2.5);
    console.debug(`Answer: ${modAnswer}, Guess: ${modGuess}, Separation: ${separation}`);
    if (separation > 8) return 0;
    if (separation > 5) return 2;
    if (separation > 2) return 3;
    return 4;
  },

  getNewWords(gameState: GameState) {
    if (gameState.remainingWordList.length === 0) {
      gameState.remainingWordList = Array.from(generateWordList());
    }
    gameState.wordSet = gameState.remainingWordList.pop();
    return gameState.wordSet;
  },
};
