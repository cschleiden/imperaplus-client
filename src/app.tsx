import "./styles/index.scss";

import * as React from "react";
import * as Redux from "redux";
import { Provider } from "react-redux";
import { IState } from "./reducers";

import { Router, Route, IndexRoute } from "react-router";

import { clear } from "./common/message/message.actions";

// Components
import MainLayout from "./components/layouts/main";
import PlayLayout from "./components/layouts/play";
import PublicLayout from "./components/layouts/public";
import PublicNav from "./components/navigation/public";
import Game from "./components/navigation/game";

// Public
import { Home, SignupConfirmation, Login } from "./pages/public";
import Signup from "./pages/public/signup";

// Game
import GameLayout from "./components/layouts/game";
import GameNav from "./components/navigation/game";
import Chat from "./common/chat/chat";
import Start from "./pages/start";
import My from "./pages/games/games";
import Create from "./pages/create/create";
import Join from "./pages/join/join";

function checkLoggedIn(store: Redux.Store<IState>, nextState, replace) {
    const state = store.getState();
    const session = state.session.data;

    if (!session.isLoggedIn) {
        replace("/login");
    }
}

export default class App extends React.Component<{ store: Redux.Store<IState>, history }, void> {
    public render() {
        return <Provider store={this.props.store}>
            <Router history={this.props.history} onUpdate={this._onRouteUpdate}>
                {/* main layout */}
                <Route component={MainLayout}>
                    {/* public */}
                    <Route path="/" components={{ nav: PublicNav, content: PublicLayout }}>
                        <IndexRoute component={Home} />

                        <Route path="signup" component={Signup} />
                        <Route path="signup/confirmation" component={SignupConfirmation} />

                        <Route path="login" component={Login} />
                    </Route>

                    { /* in game */ }
                    <Route path="/game" components={{ nav: Game, content: GameLayout, pageContent: Chat }} onEnter={checkLoggedIn.bind(this, this.props.store)}>
                        <IndexRoute component={Start} />

                        <Route path="/game/games">
                            <IndexRoute component={My} />

                            <Route path="/game/games/create" component={Create} />
                            <Route path="/game/games/join" component={Join} />
                        </Route>
                    </Route>
                </Route>

                <Route component={PlayLayout}>
                    <Route path="/game/play" />
                </Route>
            </Router>
        </Provider>;
    }

    private _onRouteUpdate = () => {
        this._clearMessage();
    };

    private _clearMessage() {    
        this.props.store.dispatch(clear(null));
    }
};