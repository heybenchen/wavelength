import {
  Container,
  Paper,
  makeStyles,
  Card,
  CardContent,
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
    width: "180px",
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

export default function Prompt() {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.cardText} color="textSecondary">Left</Typography>
        </CardContent>
      </Card>
      <div className={classes.spacer}></div>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.cardText} color="textSecondary">Right</Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
