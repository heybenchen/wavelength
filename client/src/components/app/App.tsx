import { Chip, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import background from "../../images/background@2x.png";
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
    backgroundImage: `url(${background})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundBlendMode: "exclusion",
    backgroundColor: "#181d2d",
  },
  status: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: "16px",
  },
});

function App() {
  const classes = useStyles();
  const [connectedClients, setConnectedClients] = useState([""]);
  const [socket, setSocket] = useState<SocketIOClient.Socket>();

  useEffect(() => {
    const isDevelopmentMode = process.env.NODE_ENV === "development";
    const socket = isDevelopmentMode ? io(DEVELOPMENT_PORT) : io();
    socket.on("connected ids", (data: Object) => {
      console.log("Connected IDs: ", Object.keys(data));
      setConnectedClients(Object.keys(data));
    });
    setSocket(socket);

    return function cleanup() {
      socket.disconnect();
    };
  }, []);

  return (
    <div className={classes.root}>
      <Device socket={socket} />
      <div className={classes.status}>
        <Score socket={socket} teamId={0} />
        <Chip label={`Players: ${Object.keys(connectedClients).length}`} />
        <Score socket={socket} teamId={1} />
      </div>
    </div>
  );
}

export default App;
