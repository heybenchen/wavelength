import { Chip, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Device from "../device/Device";
import Score from "../score/Score";
import { useParams } from "react-router-dom";

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
});

function Game() {
  const classes = useStyles();
  const { roomId } = useParams();
  const [connectedClients, setConnectedClients] = useState([""]);
  const [socket, setSocket] = useState<SocketIOClient.Socket>();

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

  return (
    <div className={classes.root}>
      <div className={classes.status}>
        <Score socket={socket} teamId={0} />
        <Chip label={getPlayersString()} />
        <Score socket={socket} teamId={1} />
      </div>
      <Device socket={socket} />
    </div>
  );
}

export default Game;
