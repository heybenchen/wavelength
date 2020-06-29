import { makeStyles, Typography } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "24px",
    margin: "auto",
    width: "280px",
  },
  cardText: {
    fontSize: "18px",
    padding: "8px",
  },
  cardArrow: {
    fontSize: "28px",
    marginBottom: "-8px",
  },
  card: {
    width: "50%",
    height: "100px",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
});

type PromptProps = {
  wordSet: string[] | undefined;
};

export default function Prompt(props: PromptProps) {
  const classes = useStyles();
  const wordSet = props.wordSet || ["Left", "Right"];

  return (
    <div className={classes.root}>
      <div
        className={classes.card}
        style={{ backgroundColor: "#78B46F", borderRadius: "8px 0px 0px 8px" }}
      >
        <div className={classes.cardArrow}>⟵</div>
        <div className={classes.cardText}>{wordSet[0]}</div>
      </div>
      <div
        className={classes.card}
        style={{ backgroundColor: "#E3B55F", borderRadius: "0px 8px 8px 0px" }}
      >
        <div className={classes.cardArrow}>⟶</div>
        <div className={classes.cardText}>{wordSet[1]}</div>
      </div>
    </div>
  );
}
