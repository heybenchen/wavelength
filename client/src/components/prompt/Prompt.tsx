import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "24px",
    margin: "auto",
    width: "280px",
    boxShadow: "0px 2px 4px 0px rgba(0,0,0,0.25)",
    borderRadius: "8px",
  },
  cardText: {
    fontSize: "40px",
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

export type PromptProps = {
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
