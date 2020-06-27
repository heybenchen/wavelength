import { Button, ButtonGroup, makeStyles } from "@material-ui/core";
import React, { useState, useEffect } from "react";

const useStyles = makeStyles({
  root: {
    margin: "0 16px",
  },
  button: {
    minWidth: "10px",
  }
});

type ScoreProps = {
  color: "default" | "primary" | "secondary" | undefined;
  score: number;
  socket: SocketIOClient.Socket | undefined;
};


export default function Score({color, score, socket}: ScoreProps) {
  const classes = useStyles();
  const [counter, setCounter] = useState(0);

  const handleIncrement = () => {
    setCounter(counter + 1);
  };

  const handleDecrement = () => {
    if (counter <= 0) return;
    setCounter(counter - 1);
  };

  //TODO: Sync scores

  return (
    <ButtonGroup className={classes.root} size="small" variant="contained" color={color}>
      <Button className={classes.button} size="small" onClick={handleDecrement}>-</Button>
      <Button className={classes.button} variant="contained">{counter}</Button>
      <Button className={classes.button} onClick={handleIncrement}>+</Button>
    </ButtonGroup>
  );
}
