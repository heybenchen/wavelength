import { Button, ButtonGroup, makeStyles } from "@material-ui/core";
import React, { useState, useEffect, useCallback } from "react";

const useStyles = makeStyles({
  root: {
    margin: "0 16px",
  },
  button: {
    minWidth: "10px",
  },
});

export type ScoreProps = {
  socket: SocketIOClient.Socket | undefined;
  teamId: 0 | 1;
};

export default function Score({ teamId, socket }: ScoreProps) {
  const classes = useStyles();
  const [score, setScore] = useState(0);

  const updateScore = useCallback(
    (teamScores: number[]) => {
      setScore(teamScores[teamId]);
    },
    [teamId]
  );

  const incrementScore = () => {
    socket && socket.emit("increment score", teamId);
  };

  const decrementScore = () => {
    socket && socket.emit("decrement score", teamId);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("receive score", updateScore);

    return function cleanup() {
      socket.off("receive score");
    };
  }, [socket, updateScore]);

  return (
    <ButtonGroup
      className={classes.root}
      size="small"
      variant="contained"
      color={teamId ? "primary" : "secondary"}
    >
      <Button className={classes.button} onClick={decrementScore}>
        -
      </Button>
      <Button className={classes.button} variant="contained">
        {score}
      </Button>
      <Button className={classes.button} onClick={incrementScore}>
        +
      </Button>
    </ButtonGroup>
  );
}
