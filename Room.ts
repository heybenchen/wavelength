import generateWordList from "./wordlist";

type GameState = {
  answer: number;
  guess: number;
  isRevealed: boolean;
  remainingWordList: string[][];
  wordSet: string[] | undefined;
  teamScores: number[];
};

export default class Room {
  connectedIds: any;
  gameState: GameState;

  constructor() {
    let wordList: string[][] = Array.from(generateWordList());
    this.connectedIds = {};
    this.gameState = {
      answer: Math.random() * 360,
      guess: 0,
      isRevealed: false,
      remainingWordList: wordList,
      wordSet: wordList[0],
      teamScores: [0, 0],
    };
  }

  getPoints() {
    let modAnswer = (this.gameState.answer % 360) % 180;
    let normalizedGuess =
      this.gameState.guess < 0 ? this.gameState.guess + 360 : this.gameState.guess;
    let modGuess = normalizedGuess % 180;
    let separation = Math.ceil(Math.abs(modGuess - modAnswer) / 2.5);
    console.debug(`Answer: ${modAnswer}, Guess: ${modGuess}, Separation: ${separation}`);
    if (separation > 8) return 0;
    if (separation > 5) return 2;
    if (separation > 2) return 3;
    return 4;
  }

  getNewWords() {
    if (this.gameState.remainingWordList.length === 0) {
      this.gameState.remainingWordList = Array.from(generateWordList());
    }
    this.gameState.wordSet = this.gameState.remainingWordList.pop();
    return this.gameState.wordSet;
  }

  incrementScore(teamId: number) {
    this.gameState.teamScores[teamId] = this.gameState.teamScores[teamId] + 1;
  }

  decrementScore(teamId: number) {
    this.gameState.teamScores[teamId] = Math.max(this.gameState.teamScores[teamId] - 1, 0);
  }
}
