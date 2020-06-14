import React from "react";
import classNames from 'classnames';
import { makeStyles } from "@material-ui/core/styles";
import deviceTarget from "../../images/device/Target.svg";
import deviceCover from "../../images/device/Cover.svg";
import deviceDial from "../../images/device/Dial.svg";

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
  },
  deviceContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  deviceImg: {
    position: "absolute",
    width: "90%",
    height: "auto",
    maxWidth: "600px",
  },
  deviceScore: {
    transition: "transform 1.5s ease-out",
  },
  deviceCover: { },
  deviceDial: { },
});

export default function Dial() {
  const classes = useStyles();
  const [rotationValue, setRotationValue] = React.useState(0);

  const randomRotationValue = () => {
    setRotationValue(Math.random() * 360 + 180 + rotationValue);
  };

  return (
    <div className={classes.root}>
      <div className={classes.deviceContainer}>
        <img
          className={classNames(classes.deviceImg, classes.deviceScore)}
          style={{
            transform: `rotate(${rotationValue}deg)`,
          }}
          src={deviceTarget}
          alt="Device Score"
        />
        <img
          className={classNames(classes.deviceImg, classes.deviceCover)}
          style={{}}
          src={deviceCover}
          alt="Device Cover"
        />
        <img
          className={classNames(classes.deviceImg, classes.deviceDial)}
          style={{}}
          src={deviceDial}
          alt="Device Dial"
          onClick={randomRotationValue}
        />
      </div>
    </div>
  );
}
