import {
  Card,
  CardContent,
  Container,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "24px",
  },
  card: {
    display: "flex",
    height: "100px",
    width: "160px",
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    fontSize: "20px",
  },
  spacer: {
    width: "24px",
    height: "24px",
  },
});

type PromptProps = {
  wordSet: string[] | undefined;
};

export default function Prompt({ wordSet = ["Left", "Right"] }: PromptProps) {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.cardText} color="textSecondary">
            {wordSet[0]}
          </Typography>
        </CardContent>
      </Card>
      <div className={classes.spacer}></div>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.cardText} color="textSecondary">
            {wordSet[1]}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
