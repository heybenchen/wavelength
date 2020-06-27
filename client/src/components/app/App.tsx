import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Device from "../device/Device";
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
      <div className="app__connected__container">
        Connected: {Object.keys(connectedClients).length}
      </div>
    </div>
  );
}

export default App;
