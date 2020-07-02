import React from "react";
import Game from "../game/Game";
import Home from "../home/Home";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <Home />
        </Route>
        <Route path="/game/:id" children={<Game />}></Route>
      </Switch>
    </Router>
  );
}

export default App;
