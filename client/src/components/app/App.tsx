import { Chip, makeStyles } from "@material-ui/core";
import React, { useEffect, useState, SetStateAction } from "react";
import io from "socket.io-client";
import Device from "../device/Device";
import Score from "../score/Score";
import background from "../../images/background.jpg";

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
    backgroundBlendMode: "difference",
    transition: "background-color 3s ease",
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
  const [backgroundColor, setBackgroundColor] = useState<string | undefined>();

  useEffect(() => {
    const isDevelopmentMode = process.env.NODE_ENV === "development";
    const socket = isDevelopmentMode ? io(DEVELOPMENT_PORT) : io();
    socket.on("connected ids", (data: Object) => {
      console.log("Connected IDs: ", Object.keys(data));
      setConnectedClients(Object.keys(data));
    });
    setSocket(socket);

    socket.on("receive new round", () => {
      setBackgroundColor(generateRandomColor());
    });

    return function cleanup() {
      socket.disconnect();
    };
  }, []);

  const generateRandomColor = () => {
    return shuffle([
      "aliceblue",
      "ivory",
      "blue",
      "burlywood",
      "yellow",
      "tomato",
      "orangered",
      "pink",
      "coral",
      "dimgrey",
      "darkorange",
      "darkgreen",
      "unset",
    ]).pop();
  };

  const shuffle = (a: string[]) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  return (
    <div className={classes.root} style={{ backgroundColor }}>
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
