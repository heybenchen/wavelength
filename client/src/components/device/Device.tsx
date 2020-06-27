import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import React, { useEffect } from "react";
import deviceCover from "../../images/device/Cover.svg";
import deviceDial from "../../images/device/Dial.svg";
import deviceTarget from "../../images/device/Target.svg";
import deviceVisor from "../../images/device/Visor.svg";

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
    width: "70vmin",
    height: "auto",
    objectFit: "scale-down",
  },
  deviceScore: {
    transition: "transform 1.2s ease",
  },
  deviceCover: {},
  deviceDial: {
    transition: "transform .6s ease",
  },
  deviceVisor: {},
  buttonContainer: {
    display: "flex",
    alignSelf: "center",
    marginBottom: "20px",
  },
  spacer: {
    width: "16px",
    height: "16px",
  },
});

const MAX_VISOR = 170;

type DeviceProps = {
  socket: SocketIOClient.Socket | undefined;
};

export default function Device({ socket }: DeviceProps) {
  const classes = useStyles();
  const [scoreRotationValue, setScoreRotationValue] = React.useState(0);
  const [dialRotationValue, setDialRotationValue] = React.useState(0);
  const [visorRotationValue, setVisorRotationValue] = React.useState(0);
  const [visorAnimationDuration, setVisorAnimationDuration] = React.useState(2);

  useEffect(() => {
    if (!socket) return;

    socket.on("receive guess", setDialRotationValue);
    socket.on("receive new round", resetDevice);
    socket.on("receive reveal", showVisor);

    return function cleanup() {
      socket.off("receive guess");
      socket.off("receive new round");
      socket.off("receive reveal");
    };
  }, [socket]);

  const randomScore = () => {
    return Math.random() * 360 + 180 + scoreRotationValue;
  };

  const showVisor = () => {
    setVisorRotationValue(MAX_VISOR);
  };

  const hideVisor = () => {
    setVisorRotationValue(0);
  };

  const resetDevice = (score: number) => {
    hideVisor();
    setVisorAnimationDuration(0.6);
    setDialRotationValue(0);
    window.setTimeout(() => {
      setVisorAnimationDuration(2);
      setScoreRotationValue(score);
    }, 600);
  };

  const handleDeviceClick = (event: React.MouseEvent) => {
    let midpointX = window.innerWidth / 2;
    let midpointY = window.innerHeight / 2;

    if (event.clientY > midpointY) {
      return;
    }

    // TODO: Replace with better touch accuracy
    let guess = ((event.clientX - midpointX) / midpointX) * 180;
    guess = Math.max(guess, -80);
    guess = Math.min(guess, 80);
    setDialRotationValue(guess);
    emitGuess(guess);
  };

  const emitNewRound = () => {
    socket && socket.emit("send new round", randomScore());
  }

  const emitGuess = (guess: number) => {
    socket && socket.emit("send guess", guess);
  }

  const emitReveal = () => {
    socket && socket.emit("send reveal", true);
  }

  return (
    <div className={classes.root}>
      <div className={classes.deviceContainer} onClick={handleDeviceClick}>
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
            transition: `transform ${visorAnimationDuration}s ease`,
          }}
          src={deviceVisor}
          alt="Device Visor"
        />
        <img
          className={classNames(classes.deviceImg, classes.deviceCover)}
          style={{}}
          src={deviceCover}
          alt="Device Cover"
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
        <Button variant="contained" color="primary" onClick={emitReveal}>
          Reveal
        </Button>
        <div className={classes.spacer}></div>
        <Button variant="contained" color="secondary" onClick={emitNewRound}>
          New Round
        </Button>
      </div>
    </div>
  );
}
