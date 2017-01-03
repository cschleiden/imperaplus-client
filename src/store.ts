import * as Redux from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import * as debounce from "lodash/debounce";
import { push } from "react-router-redux";

import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { syncHistoryWithStore, routerMiddleware } from "react-router-redux";

import thunkMiddleware from "redux-thunk";
import * as createLogger from "redux-logger";
import promiseMiddleware from "./middleware/promise-middleware";

import { IAsyncActionDependencies } from "./lib/action";
import { getCachedClient, createClientWithToken } from "./clients/clientFactory";
import { getSignalRClient, ISignalRClient } from "./clients/signalrFactory";

// Reducers
import { makeImmutable, IImmutable } from "immuts";
import rootReducer, { IState } from "./reducers";

import { baseUri } from "./configuration";

import { AccountClient } from "./external/imperaClients";
import { ISessionState } from "./common/session/session.reducer";
import { SessionService } from "./common/session/session.service";
import { refresh, expire } from "./common/session/session.actions";

// Create main store
const compose = composeWithDevTools({
  serializeState: (key, value) => value && value.data ? value.data : value,
  deserializeState: (state) => ({
    routing: state && state.routing,
    form: makeImmutable(state.form),
    session: makeImmutable(state.session),
    create: makeImmutable(state.create)
  }),
  shouldHotReload: true
}) || Redux.compose;

// Get initial session data from sessionStorage
const sessionDataStringified = sessionStorage.getItem("impera");
const sessionData: any = sessionDataStringified && JSON.parse(sessionDataStringified);

// Get language preference from localStorage
const language = localStorage.getItem("impera-lang") || "en";

const state = Object.assign(sessionData, { language: language });
const sessionState = sessionData && makeImmutable(state) as ISessionState || undefined;

export var store = Redux.createStore<IState>(
  rootReducer,
  {
    // Pre-populate stored session data
    session: sessionState
  } as IState,
  compose(
    Redux.applyMiddleware(
      routerMiddleware(browserHistory),
      promiseMiddleware as any,
      thunkMiddleware.withExtraArgument({
        getCachedClient: getCachedClient,
        createClientWithToken: createClientWithToken,
        getSignalRClient: getSignalRClient
      } as IAsyncActionDependencies),
      createLogger())));

// Persist session settings to sesson storage
store.subscribe(debounce(() => {
  const state = store.getState();
  const sessionState = state && state.session && state.session.toJS();

  if (sessionState) {
    sessionStorage.setItem("impera", JSON.stringify(sessionState));
  }
}, 1000));