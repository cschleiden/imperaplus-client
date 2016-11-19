import * as Redux from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { syncHistoryWithStore, routerMiddleware } from "react-router-redux";

import thunkMiddleware from "redux-thunk";
import * as createLogger from "redux-logger";
import promiseMiddleware from "./middleware/promise-middleware";

// Reducers
import { makeImmutable, IImmutable } from "immuts";
import rootReducer from "./reducers/index";

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

export const store = Redux.createStore(
  rootReducer,
  compose(
    Redux.applyMiddleware(
      routerMiddleware(browserHistory),
      promiseMiddleware as any,
      thunkMiddleware,
      createLogger())));