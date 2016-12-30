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
import { SessionService } from "./common/session/session.service";
import { refresh, expire } from "./common/session/session.actions";

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

const sessionDataStringified = sessionStorage.getItem("impera");
const sessionData = sessionDataStringified && JSON.parse(sessionDataStringified);

// TODO: CS: Move?!
const onUnauthorized = (): Promise<void> => {
  // Try to refresh
  let service = new SessionService(getCachedClientWrapper(AccountClient));

  return service.refresh(store.getState().session.data.refresh_token).then((result) => {
    store.dispatch(refresh(result.access_token, result.refresh_token));
  }, () => {
    // Clear all tokens
    store.dispatch(expire());
    
    store.dispatch(push("/login"));
    throw new Error(__("Your session expired. Please login again."));
  });
};
var getCachedClientWrapper = getCachedClient.bind(null, onUnauthorized);

export var store = Redux.createStore<IState>(
  rootReducer,
  {
    // Pre-populate stored session data
    session: sessionData && makeImmutable(sessionData) || undefined
  } as IState,
  compose(
    Redux.applyMiddleware(
      routerMiddleware(browserHistory),
      promiseMiddleware as any,
      thunkMiddleware.withExtraArgument({
        getCachedClient: getCachedClientWrapper,
        createClientWithToken: createClientWithToken.bind(null, onUnauthorized),
        getSignalRClient: (hubName: string, options): ISignalRClient => {
          const token = store.getState().session.data.access_token;
          return getSignalRClient(baseUri, token, hubName, options);
        }
      } as IAsyncActionDependencies),
      createLogger())));

// Persist session settings
store.subscribe(debounce(() => {
  const state = store.getState();
  const sessionState = state && state.session && state.session.toJS();

  if (sessionState) {
    sessionStorage.setItem("impera", JSON.stringify(sessionState));
  }
}, 1000));