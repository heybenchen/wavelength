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
  socket: SocketIOClient.Socket | undefined;
  teamId: 0 | 1;
};


export default function Score({teamId, socket}: ScoreProps) {
  const classes = useStyles();
  const [score, setScore] = useState(0);

  const updateScore = (teamScores: number[]) => {
    setScore(teamScores[teamId]);
  };

  const incrementScore = () => {
    socket && socket.emit("increment score", teamId);
  }

  const decrementScore = () => {
    socket && socket.emit("decrement score", teamId);
  }

  useEffect(() => {
    if (!socket) return;

    socket.on("receive score", updateScore);

    return function cleanup() {
      socket.off("receive score");
    };
  }, [socket]);

  return (
    <ButtonGroup className={classes.root} size="small" variant="contained" color={teamId ? "primary" : "secondary"}>
      <Button className={classes.button} size="small" onClick={decrementScore}>-</Button>
      <Button className={classes.button} variant="contained">{score}</Button>
      <Button className={classes.button} onClick={incrementScore}>+</Button>
    </ButtonGroup>
  );
}
