import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app/App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.Fragment>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
    />
    <App />
  </React.Fragment>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
