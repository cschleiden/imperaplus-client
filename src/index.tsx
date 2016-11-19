// Hot reloading
import { AppContainer } from "react-hot-loader";

// Theming
import { loadTheme, ITheme } from "@microsoft/load-themed-styles";

// Override theme
loadTheme({
  themeDarker: "#cfac1e",
  themeDark: "#dfbb28",
  themeDarkAlt: "#e3c23e",
  themePrimary: "#e6c954",
  themeSecondary: "#e9d06a",
  themeTertiary: "#edd780",
  themeLight: "#f3e5ad",
  themeLighter: "#faf3d9",
  themeLighterAlt: "#fdfaf0",
});

import * as React from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { syncHistoryWithStore, routerMiddleware } from "react-router-redux";

import App from "./app";
import { store } from "./store";

const rootElement = document.getElementById("root");

render(
  <AppContainer>
    <App store={store} history={syncHistoryWithStore(browserHistory as any, store)} />
  </AppContainer>,
  rootElement);

// Hot Module Replacement API
declare var module: any;

if (module.hot) {
  module.hot.accept(["./app"], () => {
    const NextApp = require("./app").default;
    render(<AppContainer>
      <NextApp store={store} />
    </AppContainer>,
      rootElement
    );
  });
}