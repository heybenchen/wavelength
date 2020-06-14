import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import dialScore from "../../images/scoreboard.svg";
import { Button } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%',
  },
  dial: {
    transition: 'transform 2s ease',
  },
});

export default function Dial() {
  const classes = useStyles();
  const [rotationValue, setRotationValue] = React.useState(0);

  const randomRotationValue = () => {
    setRotationValue(Math.random() * 360 + 360 + rotationValue);
  }

  return (
    <div className={classes.root}>
      <div>
        <img
          className={classes.dial}
          style={{
            transform: `rotate(${rotationValue}deg)`,
          }}
          src={dialScore}
          alt="Dial"/>
      </div>
      <Button
        variant="contained"
        onClick={randomRotationValue}
      >
        Random
      </Button>
    </div>
  );
}
