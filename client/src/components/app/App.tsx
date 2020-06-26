import React, { useState, useEffect } from "react";
import Device from "../device/Device";
import "./App.css";
import io from "socket.io-client";

const DEVELOPMENT_PORT = ":9001";

function App() {
  const [connectedClients, setConnectedClients] = useState([""]);
  const [socket, setSocket] = useState<SocketIOClient.Socket>();

  useEffect(() => {
    const isDevelopmentMode = process.env.NODE_ENV === "development";
    const socket = isDevelopmentMode ? io(DEVELOPMENT_PORT) : io();
    socket.on("connected ids", (data: Object) => {
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
        <div className="app__connected__text">
          {connectedClients.map((clientName, index) => {
            return <div key={index}>{clientName}</div>;
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
