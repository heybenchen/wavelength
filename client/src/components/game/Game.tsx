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
    alignItems: "top",
    width: "100%",
    marginTop: "16px",
  },
  teamContainer: {
    display: "flex",
    flexDirection: "column",
  },
  playerName: {
    fontSize: "8px",
    marginTop: "4px",
  },
});

type Player = {
  name: string;
  teamId: number;
};

function Game() {
  const classes = useStyles();
  const { roomId } = useParams();
  const [connectedClients, setConnectedClients] = useState<{ [key: string]: Player }>({});
  const [socket, setSocket] = useState<SocketIOClient.Socket>();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [playerName, setPlayerName] = React.useState("");
  const [teamId, setTeamId] = React.useState(-1);

  const getClientsInTeam = (teamId: number) => {
    const clients: { [key: string]: Player } = {};
    for (const [socketId, player] of Object.entries(connectedClients)) {
      if (player.teamId === teamId) clients[socketId] = player;
    }
    return clients;
  };

  const getPlayersString = () => {
    const playerCount = Object.keys(connectedClients).length;
    if (playerCount <= 1) {
      return "Waiting for players";
    }
    return `${playerCount} Players.`;
  };

  const getPlayerNames = (teamId: number) => {
    return Object.values(getClientsInTeam(teamId)).map((player, index) => {
      return (
        <div key={index} className={classes.playerName}>
          {player.name}
        </div>
      );
    });
  };

  const handlePlayerInfoOpen = () => {
    setDialogOpen(true);
  };

  const handlePlayerInfoSave = () => {
    setDialogOpen(false);
    persistPlayerInfo();
    socket && socket.emit("join room", roomId, playerName, teamId);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName((event.target as HTMLInputElement).value);
  };

  const handleTeamChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeamId(parseInt((event.target as HTMLInputElement).value));
  };

  const persistPlayerInfo = () => {
    sessionStorage.setItem("playerName", playerName);
    sessionStorage.setItem("teamId", teamId.toString());
  };

  const retrievePlayerInfo = () => {
    let playerName = sessionStorage.getItem("playerName") || "";
    let teamId = parseInt(sessionStorage.getItem("teamId") || "");
    console.log(`Restoring player "${playerName}" on the ${teamId ? "Blue" : "Red"} Team`);
    setPlayerName(playerName);
    setTeamId(teamId);
    return [playerName, teamId];
  };

  useEffect(() => {
    const isDevelopmentMode = process.env.NODE_ENV === "development";
    const socket = isDevelopmentMode ? io(DEVELOPMENT_PORT) : io();
    socket.on("connected ids", setConnectedClients);
    setSocket(socket);

    const [playerName, teamId] = retrievePlayerInfo();
    if (!playerName || teamId === -1) {
      setDialogOpen(true);
    } else {
      socket && socket.emit("join room", roomId, playerName, teamId);
    }

    return function cleanup() {
      socket.disconnect();
    };
  }, [roomId]);

  return (
    <div className={classes.root}>
      <div className={classes.status}>
        <div className={classes.teamContainer}>
          <Score socket={socket} teamId={0} />
          {getPlayerNames(0)}
        </div>
        <Chip label={getPlayersString()} onClick={handlePlayerInfoOpen} />
        <div className={classes.teamContainer}>
          <Score socket={socket} teamId={1} />
          {getPlayerNames(1)}
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
              value={playerName}
              fullWidth
              autoComplete="off"
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
            <Button
              onClick={handlePlayerInfoSave}
              color="primary"
              disabled={!playerName || teamId === -1}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Game;
