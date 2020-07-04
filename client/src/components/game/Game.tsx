import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  FormControlLabel,
  makeStyles,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Device from "../device/Device";
import Score from "../score/Score";

const DEVELOPMENT_PORT = ":9001";

const useStyles = makeStyles({
  root: {
    textAlign: "center",
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "calc(10px + 1.5vmin)",
    backgroundColor: "#c2cdd4",
  },
  status: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: "16px",
  },
  teamContainer: {
    display: "flex",
    flexDirection: "column",
  },
  playerName: {
    fontSize: "8px",
  },
});

function Game() {
  const classes = useStyles();
  const { roomId } = useParams();
  const [connectedClients, setConnectedClients] = useState([""]);
  const [socket, setSocket] = useState<SocketIOClient.Socket>();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [teamId, setTeamId] = React.useState(-1);
  const [userName, setUserName] = React.useState("");

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName((event.target as HTMLInputElement).value);
  };

  const handleTeamChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeamId(parseInt((event.target as HTMLInputElement).value));
  };

  useEffect(() => {
    const isDevelopmentMode = process.env.NODE_ENV === "development";
    const socket = isDevelopmentMode ? io(DEVELOPMENT_PORT) : io();
    socket.on("connected ids", (data: Object) => setConnectedClients(Object.keys(data)));
    socket.on("connect", () => socket.emit("join room", roomId));
    setSocket(socket);

    return function cleanup() {
      socket.disconnect();
    };
  }, [roomId]);

  const getPlayersString = () => {
    const playerCount = Object.keys(connectedClients).length;
    if (playerCount <= 1) {
      return "Waiting for players";
    }
    return `${playerCount} Players`;
  };

  const connectedClientNames = Object.values(connectedClients).map((client, index) => {
    return (
      <div key={index} className={classes.playerName}>
        {/* {client} */}
      </div>
    );
  });

  return (
    <div className={classes.root}>
      <div className={classes.status}>
        <div className={classes.teamContainer}>
          <Score socket={socket} teamId={0} />
          {connectedClientNames}
        </div>
        <Chip label={getPlayersString()} onClick={handleDialogOpen} />
        <div className={classes.teamContainer}>
          <Score socket={socket} teamId={1} />
          {connectedClientNames}
        </div>
      </div>
      <Device socket={socket} />
      <div>
        <Dialog open={dialogOpen} aria-labelledby="form-dialog-title">
          {/* <DialogTitle id="form-dialog-title">Join a team</DialogTitle> */}
          <DialogContent>
            <DialogContentText>Enter your name and join a team to start playing.</DialogContentText>
            <TextField
              onChange={handleNameChange}
              autoFocus
              margin="dense"
              id="name"
              label="Your name"
              type="text"
              value={userName}
              fullWidth
            />
            <Box m={1} />
            <FormControl component="fieldset">
              {/* <FormLabel component="legend">Team</FormLabel> */}
              <RadioGroup name="team" value={teamId} onChange={handleTeamChange}>
                <FormControlLabel value={0} control={<Radio />} label="Red Team" />
                <FormControlLabel value={1} control={<Radio color="primary" />} label="Blue Team" />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Game;
