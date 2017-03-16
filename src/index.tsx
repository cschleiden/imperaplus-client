// Hot reloading
import { AppContainer } from "react-hot-loader";

// TODO: Move to scss
/*loadTheme({
  themeDarker: "#cfac1e",
  themeDark: "#dfbb28",
  themeDarkAlt: "#e3c23e",
  themePrimary: "#e6c954",
  themeSecondary: "#e9d06a",
  themeTertiary: "#edd780",
  themeLight: "#f3e5ad",
  themeLighter: "#faf3d9",
  themeLighterAlt: "#fdfaf0"
});*/

import * as React from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { syncHistoryWithStore, routerMiddleware } from "react-router-redux";

import { TokenProvider } from "./services/tokenProvider";

import App from "./app";
import { store } from "./store";

// Set token retriever for http clients from global state.
TokenProvider.tokenRetriever = () => {
  let state = store && store.getState();
  if (state) {
    const session = state.session.data;
    return session.access_token;
  }
};

// Hot Module Replacement API
declare var module: any;

const rootElement = document.getElementById("root");

render(
  <AppContainer>
    <App store={store} history={syncHistoryWithStore(browserHistory as any, store)} />
  </AppContainer>,
  rootElement);

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
