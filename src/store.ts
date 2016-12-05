import * as Redux from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

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

// Create main store
// TODO: CS: generalize
const compose = composeWithDevTools({
  serializeState: (key, value) => value && value.data ? value.data : value,
  deserializeState: (state) => ({
    routing: state && state.routing,
    form: makeImmutable(state.form),
    sessions: makeImmutable(state.session),
    create: makeImmutable(state.create)
  }),
  shouldHotReload: true
}) || Redux.compose;

// TODO: CS: Retrieve from config
const baseUri = "http://localhost:57676/";

export const store = Redux.createStore<IState>(
  rootReducer,
  compose(
    Redux.applyMiddleware(
      routerMiddleware(browserHistory),
      promiseMiddleware as any,
      thunkMiddleware.withExtraArgument({
        getCachedClient: getCachedClient.bind(null, baseUri),
        createClientWithToken: createClientWithToken.bind(null, baseUri),
        getSignalRClient: (hubName: string, options): ISignalRClient => {
          const token = store.getState().session.data.access_token;
          return getSignalRClient(baseUri, token, hubName, options);
        }
      } as IAsyncActionDependencies),
      createLogger())));