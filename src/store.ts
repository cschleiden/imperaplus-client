import * as Redux from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import { browserHistory } from "react-router";
import { routerMiddleware } from "react-router-redux";

import * as createLogger from "redux-logger";
import thunkMiddleware from "redux-thunk";
import promiseMiddleware from "./middleware/promise-middleware";

import { createClientWithToken, getCachedClient, setOnUnauthorized } from "./clients/clientFactory";
import { getSignalRClient } from "./clients/signalrFactory";
import { failed, IAsyncActionDependencies, pending, success } from "./lib/action";

// Reducers
import { makeImmutable } from "immuts";
import rootReducer, { IState } from "./reducers";

import { loadingBarMiddleware } from "react-redux-loading-bar";
import { ISessionState } from "./common/session/session.reducer";
import { SessionService } from "./common/session/session.service";
import { debounce } from "./lib/debounce";
import { UserProvider } from "./services/userProvider";

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

const initialState = Object.assign({}, sessionData, { language: language });
const initialSessionState = sessionData && makeImmutable(initialState) as ISessionState || undefined;

export let store = Redux.createStore<IState>(
  rootReducer,
  {
    // Pre-populate stored session data
    session: initialSessionState
  } as IState,
  compose(
    Redux.applyMiddleware(
      routerMiddleware(browserHistory as any),
      loadingBarMiddleware({
        promiseTypeSuffixes: [pending(""), success(""), failed("")]
      }),
      promiseMiddleware as any,
      thunkMiddleware.withExtraArgument({
        getCachedClient: getCachedClient,
        createClientWithToken: createClientWithToken,
        getSignalRClient: getSignalRClient
      } as IAsyncActionDependencies),
        (createLogger as any)())));

// Persist session settings to session storage
store.subscribe(debounce(() => {
  const state = store.getState();
  const sessionState = state && state.session && state.session.toJS();

  if (sessionState) {
    sessionStorage.setItem("impera", JSON.stringify(sessionState));
  }
}, 1000));

// Setup handler for 401 resposes
setOnUnauthorized(() => {
  return SessionService.getInstance().reAuthorize();
});

UserProvider.userProvider = () => {
  const userInfo = store.getState().session.data.userInfo;
  return userInfo && userInfo.userId;
};