import React, { useState, useEffect } from 'react';
import Device from '../device/Device';
import './App.css';
import socketIOClient from 'socket.io-client';
const SERVER_PORT = ":9000";

function App() {
  const [playerCount, setPlayerCount] = useState(0);

  useEffect(() => {
    const socket = socketIOClient(SERVER_PORT);
    socket.on("new connection", (data: number) => {
      setPlayerCount(data);
    });
    return function cleanup() {
      socket.disconnect();
    }
  }, []);

  return (
    <div className="App">
      <Device/>
      <div>
        Connected: {playerCount}
      </div>
    </div>
  );
}

export default App;
