// Hot reloading
import { AppContainer } from "react-hot-loader";

import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./app";


const rootElement = document.getElementById("root");

ReactDOM.render(
  <AppContainer>
    <App />
  </AppContainer>,
  rootElement);

// Hot Module Replacement API
declare var module: any;

if (module.hot) {
  module.hot.accept("./app", () => {
    const NextApp = require("./app").default;
    ReactDOM.render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      rootElement
    );
  });
}