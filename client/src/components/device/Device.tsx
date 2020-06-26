import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import React from "react";
import deviceCover from "../../images/device/Cover.svg";
import deviceDial from "../../images/device/Dial.svg";
import deviceTarget from "../../images/device/Target.svg";
import deviceVisor from "../../images/device/Visor.svg";
import {Button } from "@material-ui/core";

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
  deviceVisor: { },
  buttonContainer: {
    display: "flex",
    alignSelf: "center",
    marginBottom: "20px",
  },
  spacer: {
    width: "16px",
    height: "16px",
  }
});

export default function Dial() {
  const classes = useStyles();
  const [scoreRotationValue, setScoreRotationValue] = React.useState(0);
  const [dialRotationValue, setDialRotationValue] = React.useState(0);
  const [visorRotationValue, setVisorRotationValue] = React.useState(0);
  const [visorAnimationDuration, setVisorAnimationDuration] = React.useState(2);

  const randomizeScore = () => {
    setScoreRotationValue(Math.random() * 360 + 180 + scoreRotationValue);
  };
  const revealScore = () => {
    visorRotationValue === 0 ? setVisorRotationValue(170) : setVisorRotationValue(0);
  };

  const resetDevice = () => {
    setVisorRotationValue(0);
    setVisorAnimationDuration(0.6);
    setDialRotationValue(0);
    window.setTimeout(() => {
      randomizeScore();
      setVisorAnimationDuration(2);
    }, 600);
  }

  const handleDeviceClick = (event: React.MouseEvent) => {
    let midpointX = window.innerWidth / 2;
    let midpointY = window.innerHeight / 2;

    if (event.clientY > midpointY) { return; }

    let guess = (event.clientX - midpointX) / midpointX * 180;
    guess = Math.max(guess, -80);
    guess = Math.min(guess, 80);
    setDialRotationValue(guess);
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
        <Button variant="contained" color="primary" onClick={revealScore}>Reveal</Button>
        <div className={classes.spacer}></div>
        <Button variant="contained" color="secondary" onClick={resetDevice} >New Round</Button>
      </div>
    </div>
  );
}
