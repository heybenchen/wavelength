import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Device from "../device/Device";
import Score from "../score/Score";
import "./App.css";

const DEVELOPMENT_PORT = ":9001";

function App() {
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
    <div className="app">
      <Device socket={socket} />
      <div className="app__score__container">
        <Score socket={socket} teamId={0}/>
        <div>
          Players: {Object.keys(connectedClients).length}
        </div>
        <Score socket={socket} teamId={1}/>
      </div>
    </div>
  );
}

export default App;
