import React from "react";
import Game from "../game/Game";
import Home from "../home/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/:roomId" children={<Game />} />
      </Switch>
    </Router>
  );
}

export default App;
