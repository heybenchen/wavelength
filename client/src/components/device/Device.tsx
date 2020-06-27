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
    width: "90vmin",
    height: "auto",
    objectFit: "scale-down",
  },
  deviceScore: {
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
  const [scoreRotationValue, setScoreRotationValue] = React.useState(0);
  const [dialRotationValue, setDialRotationValue] = React.useState(0);
  const [visorRotationValue, setVisorRotationValue] = React.useState(0);
  const [visorAnimationDuration, setVisorAnimationDuration] = React.useState(2);
  const [visorOpacity, setVisorOpacity] = React.useState(1);
  const [wordSet, setWordSet] = React.useState([""]);

  type GameState = {
    score: number;
    guess: number;
    isRevealed: boolean;
    wordSet: string[];
  };

  const initializeGame = ({ score, guess, isRevealed, wordSet }: GameState) => {
    setScoreRotationValue(score);
    setDialRotationValue(guess);
    setWordSet(wordSet);
    window.setTimeout(() => {
      setVisorRotationValue(isRevealed ? MAX_VISOR : 0);
    }, 1000);
  };

  const randomScore = () => {
    return Math.random() * 360 + 180 + scoreRotationValue;
  };

  const revealVisor = () => {
    setVisorRotationValue(MAX_VISOR);
  };

  const togglePeekVisor = () => {
    setVisorOpacity(visorOpacity === 1 ? 0.4 : 1);
  }

  const startNewRound = (score: number, wordSet: string[]) => {
    setWordSet(wordSet);
    setVisorOpacity(1);
    setVisorRotationValue(0);
    setVisorAnimationDuration(0.6);
    setDialRotationValue(0);
    window.setTimeout(() => {
      setVisorAnimationDuration(2);
      setScoreRotationValue(score);
    }, 600);
  };

  const handleDeviceClick = (event: React.MouseEvent) => {
    let midpointY = window.innerHeight / 2;
    if (event.clientY > midpointY) {
      return;
    }

    let { left, width } = event.currentTarget.getBoundingClientRect();
    let percentage = (event.clientX - left) / width;
    let guess = (percentage * 160 - 80) * 1.2;
    guess = Math.max(guess, MIN_DIAL);
    guess = Math.min(guess, MAX_DIAL);

    setDialRotationValue(guess);
    emitGuess(guess);
  };

  const emitNewRound = () => {
    socket && socket.emit("send new round", randomScore());
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
    socket.on("receive reveal", revealVisor);

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
          className={classNames(classes.deviceImg, classes.deviceScore)}
          style={{
            transform: `rotate(${scoreRotationValue}deg)`,
          }}
          src={deviceTarget}
          alt="Device Score"
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
