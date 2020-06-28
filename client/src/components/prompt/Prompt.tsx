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
    flex: "1",
  },
  cardContent: {
    display: "flex",
    height: "50px",
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    fontSize: "18px",
  },
  spacer: {
    width: "16px",
    height: "16px",
  },
});

type PromptProps = {
  wordSet: string[] | undefined;
};

export default function Prompt(props: PromptProps) {
  const classes = useStyles();
  const wordSet = props.wordSet || ["Left", "Right"];

  return (
    <Container className={classes.root}>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Typography className={classes.cardText} color="textSecondary">
            {wordSet[0]}
          </Typography>
        </CardContent>
      </Card>
      <div className={classes.spacer}></div>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Typography className={classes.cardText} color="textSecondary">
            {wordSet[1]}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
