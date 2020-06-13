import React from 'react';
import Gauge from '../gauge/Gauge';
import logo from '../../logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Gauge/>
      </header>
    </div>
  );
}

export default App;
