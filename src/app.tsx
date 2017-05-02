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
import ChatLayout from "./components/layouts/chat";
import adTag from "./components/commercial/adtag";
import Breadcrumbs from "./components/ui/breadcrumbs";

// Public
import { Home, Signup, SignupConfirmation, Login, TOS, Activate } from "./pages/public";

// Game
import GameLayout from "./components/layouts/game";
import GameNav from "./components/navigation/game";
import Start from "./pages/start";
import My from "./pages/games/games";
import Create from "./pages/create/create";
import Join from "./pages/join/fun";
import Ladders from "./pages/join/ladders";
import Tournaments from "./pages/tournaments/tournaments";
import Tournament from "./pages/tournaments/tournament";

// Play
import Play from "./pages/play/play";

// Alliances
import CreateAlliance from "./pages/alliance/create";
import AllianceAdmin from "./pages/alliance/admin";
import JoinAlliance from "./pages/alliance/join";
import AllianceInfo from "./pages/alliance/info";

// messages
import Messages from "./pages/messages/messages";
import Compose from "./pages/messages/compose";

// profile
import UserProfile from "./pages/profile/profile";
import { autobind } from "./lib/autobind";
import { baseUri } from "./configuration";


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
                        <Route path="activate/:userId/:code" component={Activate} />

                        <Route path="login" component={Login} />

                        <Route path="tos" component={TOS} />
                    </Route>
                </Route>

                <Route component={ChatLayout} onEnter={checkLoggedIn.bind(this, this.props.store)}>
                    <Route component={MainLayout}>
                        { /* in game */}
                        <Route path="/game" components={{ nav: Game, content: GameLayout, breadcrumbs: Breadcrumbs, commercials: adTag }}>
                            <IndexRoute component={Start} />

                            <Route path="/game/games">
                                <IndexRoute component={My} />

                                <Route path="/game/games/create" component={Create} />
                                <Route path="/game/games/join" component={Join} />
                                <Route path="/game/games/ladders" component={Ladders} />
                            </Route>

                            <Route path="/game/tournaments">
                                <IndexRoute component={Tournaments} />
                                <Route path="/game/tournaments/:id" component={Tournament} />
                            </Route>

                            <Route path="/game/alliance">
                                <Route path="/game/alliance/create" component={CreateAlliance} />
                                <Route path="/game/alliance/admin" component={AllianceAdmin} />
                                <Route path="/game/alliance/info" component={AllianceInfo} />
                                <Route path="/game/alliance/join" component={JoinAlliance} />
                            </Route>

                            <Route path="/game/messages">
                                <IndexRoute component={Messages} />

                                <Route path="/game/messages/compose" component={Compose} />
                                <Route path="/game/messages/:id" component={Messages} />
                            </Route>

                            <Route path="/game/profile/profile" component={UserProfile} />

                        </Route>
                    </Route>

                    { /* play interface */}
                    <Route path="/play" component={PlayLayout}>
                        <Route path="/play/:id">
                            <IndexRoute component={Play} />

                            <Route path="/play/:id/history/:turn" component={Play} />
                        </Route>
                    </Route>
                </Route>

                <Route path="/toadmin" onEnter={this._onAdmin}>
                </Route>
            </Router>
        </Provider>;
    }

    @autobind
    private _onAdmin() {
        const { store } = this.props;

        const token = store.getState().session.data.access_token;

        // Move token to cookie
        document.cookie = `bearer_token=${token};path=/admin`;
        window.location.href = baseUri + "admin/news";
    }

    @autobind
    private _onRouteUpdate() {
        this._clearMessage();
    };

    private _clearMessage() {
        this.props.store.dispatch(clear(null));
    }
};
