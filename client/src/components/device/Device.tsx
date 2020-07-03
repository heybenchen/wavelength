import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import React, { useEffect } from "react";
import deviceCover from "../../images/device/Cover.svg";
import deviceDial from "../../images/device/Dial.svg";
import deviceTarget from "../../images/device/Target.svg";
import deviceVisor from "../../images/device/Visor.svg";
import Prompt from "../prompt/Prompt";

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  deviceContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  deviceImg: {
    position: "absolute",
    maxWidth: "90vmin",
    maxHeight: "90vmin",
    height: "auto",
    objectFit: "cover",
  },
  deviceAnswer: {
    transition: "transform 1.2s ease",
  },
  deviceCover: {},
  deviceDial: {
    transition: "transform .6s ease",
    pointerEvents: "none",
  },
  deviceVisor: {},
  buttonContainer: {
    display: "flex",
    width: "100%",
    alignSelf: "center",
    marginBottom: "20px",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
  },
  spacer: {
    width: "16px",
    height: "16px",
  },
});

const MAX_VISOR = 170;
const MIN_DIAL = -80;
const MAX_DIAL = 80;

type DeviceProps = {
  socket: SocketIOClient.Socket | undefined;
};

export default function Device({ socket }: DeviceProps) {
  const classes = useStyles();
  const [answerRotationValue, setAnswerRotationValue] = React.useState(0);
  const [dialRotationValue, setDialRotationValue] = React.useState(0);
  const [visorRotationValue, setVisorRotationValue] = React.useState(0);
  const [visorAnimationDuration, setVisorAnimationDuration] = React.useState(2);
  const [visorOpacity, setVisorOpacity] = React.useState(1);
  const [wordSet, setWordSet] = React.useState([""]);

  type GameState = {
    answer: number;
    guess: number;
    isRevealed: boolean;
    wordSet: string[];
  };

  const initializeGame = ({ answer, guess, isRevealed, wordSet }: GameState) => {
    setAnswerRotationValue(answer);
    setDialRotationValue(guess);
    setWordSet(wordSet);
    window.setTimeout(() => {
      setVisorRotationValue(isRevealed ? MAX_VISOR : 0);
    }, 1000);
  };

  const randomAnswer = () => {
    let answer = Math.random() * 360 + 180 + answerRotationValue;
    while (answer % 180 > 77 && answer % 180 < 103) {
      answer = randomAnswer();
    }
    return answer;
  };

  const revealAnswer = (points: number) => {
    setVisorRotationValue(MAX_VISOR);
    console.log("Points scored: ", points);
  };

  const togglePeekVisor = () => {
    setVisorOpacity(visorOpacity === 1 ? 0.4 : 1);
  };

  const startNewRound = (answer: number, wordSet: string[]) => {
    setWordSet(wordSet);
    setVisorOpacity(1);
    setVisorRotationValue(0);
    setVisorAnimationDuration(0.6);
    setDialRotationValue(0);
    window.setTimeout(() => {
      setVisorAnimationDuration(2);
      setAnswerRotationValue(answer);
    }, 600);
  };

  const handleDeviceClick = (event: React.MouseEvent) => {
    let { left, width } = event.currentTarget.getBoundingClientRect();
    let percentage = (event.clientX - left) / width;
    let guess = (percentage * 160 - 80) * 1.2;
    guess = Math.max(guess, MIN_DIAL);
    guess = Math.min(guess, MAX_DIAL);

    setDialRotationValue(guess);
    emitGuess(guess);
  };

  const emitNewRound = () => {
    socket && socket.emit("send new round", randomAnswer());
  };

  const emitGuess = (guess: number) => {
    socket && socket.emit("send guess", guess);
  };

  const emitReveal = () => {
    socket && socket.emit("send reveal", true);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("initialize", initializeGame);
    socket.on("receive guess", setDialRotationValue);
    socket.on("receive new round", startNewRound);
    socket.on("receive reveal", revealAnswer);

    return function cleanup() {
      socket.off("receive guess");
      socket.off("receive new round");
      socket.off("receive reveal");
      socket.off("receive initialize");
    };
  }, [socket]);

  return (
    <div className={classes.root}>
      <Prompt wordSet={wordSet} />
      <div className={classes.deviceContainer}>
        <img
          className={classNames(classes.deviceImg, classes.deviceAnswer)}
          style={{
            transform: `rotate(${answerRotationValue}deg)`,
          }}
          src={deviceTarget}
          alt="Device Answer"
        />
        <img
          className={classNames(classes.deviceImg, classes.deviceVisor)}
          style={{
            transform: `rotate(${visorRotationValue}deg)`,
            transition: `transform ${visorAnimationDuration}s ease, opacity 1s ease`,
            opacity: visorOpacity,
          }}
          src={deviceVisor}
          alt="Device Visor"
        />
        <img
          className={classNames(classes.deviceImg, classes.deviceCover)}
          style={{}}
          src={deviceCover}
          alt="Device Cover"
          draggable={false}
          onClick={handleDeviceClick}
        />
        <img
          className={classNames(classes.deviceImg, classes.deviceDial)}
          style={{
            transform: `rotate(${dialRotationValue}deg)`,
          }}
          src={deviceDial}
          alt="Device Dial"
        />
      </div>
      <div className={classes.buttonContainer}>
        <div className={classes.spacer}></div>
        <Button className={classes.button} variant="contained" onClick={togglePeekVisor}>
          Peek
        </Button>
        <div className={classes.spacer}></div>
        <Button className={classes.button} variant="contained" onClick={emitReveal}>
          Submit
        </Button>
        <div className={classes.spacer}></div>
        <Button className={classes.button} variant="contained" onClick={emitNewRound}>
          New
        </Button>
        <div className={classes.spacer}></div>
      </div>
    </div>
  );
}
