import "./styles/index.scss";

import * as React from "react";
import { Provider } from "react-redux";
import * as Redux from "redux";
import { IState } from "./reducers";

import { EnterHook, IndexRoute, Route, Router } from "react-router";

import { clear } from "./common/message/message.actions";

// Components
import adTag from "./components/commercial/adtag";
import ChatLayout from "./components/layouts/chat";
import MainLayout from "./components/layouts/main";
import PlayLayout from "./components/layouts/play";
import PublicLayout from "./components/layouts/public";
import Game from "./components/navigation/game";
import PublicNav from "./components/navigation/public";

// Public
import {
    Activate,
    Activated,
    Home,
    Imprint,
    Login,
    Privacy,
    Reset,
    ResetConfirmation,
    ResetDone,
    ResetTriggered,
    Signup,
    SignupConfirmation,
    TOS
} from "./pages/public";

// Game
import GameLayout from "./components/layouts/game";
import GameNav from "./components/navigation/game";
import Create from "./pages/create/create";
import MapPreview from "./pages/mapPreview/mapPreview";
import My from "./pages/games/games";
import Join from "./pages/join/open";
import Ladder from "./pages/ladders/ladder";
import Ladders from "./pages/ladders/ladders";
import Start from "./pages/start";

// Tournaments
import Tournament from "./pages/tournaments/tournament";
import Tournaments from "./pages/tournaments/tournaments";
import TournamentPairing from "./pages/tournaments/tournamentPairing";

// Play
import Play from "./pages/play/play";

// Alliances
import AllianceAdmin from "./pages/alliance/admin";
import CreateAlliance from "./pages/alliance/create";
import AllianceInfo from "./pages/alliance/info";
import JoinAlliance from "./pages/alliance/join";

// messages
import Compose from "./pages/messages/compose";
import Message from "./pages/messages/message";
import Messages from "./pages/messages/messages";

// profile
import { setTitle } from "./common/general/general.actions";
import { baseUri } from "./configuration";
import { autobind } from "./lib/autobind";
import UserProfile from "./pages/profile/profile";

function checkLoggedIn(store: Redux.Store<IState>, nextState, replace) {
    const state = store.getState();
    const session = state.session.data;

    if (!session.isLoggedIn) {
        replace("/login");
    }
}

export default class App extends React.Component<{ store: Redux.Store<IState>, history }> {
    render() {
        return (
            <Provider store={this.props.store}>
                <Router
                    history={this.props.history}
                    onUpdate={(() => {
                        // Bind the app, the method needs this
                        const app = this;
                        return function (...args) { App._onRouteUpdate.call(this, app, ...args); }
                    })()}
                >
                    {/* main layout */}
                    < Route component={MainLayout}>
                        {/* public */}
                        <Route path="/" components={{ nav: PublicNav, content: PublicLayout }}>
                            <IndexRoute component={Home}  {...this._title("") } />

                            <Route path="signup" component={Signup}  {...this._title(__("Signup")) } />
                            <Route path="signup/confirmation" component={SignupConfirmation}  {...this._title(__("Registration successful")) } />

                            {/* Activate account */}
                            <Route path="activate/:userId/:code" component={Activate}  {...this._title(__("Activating Account")) } />
                            <Route path="activated" component={Activated}  {...this._title(__("Account Activated")) } />

                            {/* Reset password */}
                            <Route path="reset" component={Reset}  {...this._title(__("Reset Password")) } />
                            <Route path="reset/triggered" component={ResetTriggered}  {...this._title(__("Reset Password"))} />

                            <Route path="reset/:userId/:code" component={ResetConfirmation}  {...this._title(__("Password Reset"))} />
                            <Route path="reset/done" component={ResetDone}  {...this._title(__("Password Reset"))} />

                            <Route path="login" component={Login}  {...this._title(__("Login"))} />

                            <Route path="tos" component={TOS}  {...this._title(__("Terms of Service"))} />
                            <Route path="privacy" component={Privacy}  {...this._title(__("Privacy Policy"))} />
                            <Route path="imprint" component={Imprint}  {...this._title(__("Imprint"))} />
                        </Route>
                    </Route>

                    <Route component={ChatLayout} onEnter={checkLoggedIn.bind(this, this.props.store)}>
                        <Route component={MainLayout}>
                            {/* in game */}
                            <Route
                                path="/game"
                                components={{
                                    nav: Game,
                                    content: GameLayout,
                                    commercials: null
                                }}>
                                <IndexRoute component={Start} {...this._title(__("News"))} />

                                <Route path="/game/mapPreview/:name" component={MapPreview} />

                                <Route path="/game/games">
                                    <IndexRoute component={My} {...this._title(__("My Games"))} />

                                    <Route path="/game/games/create" component={Create} {...this._title(__("Create Game"))} />
                                    <Route path="/game/games/join" component={Join}  {...this._title(__("Join Game"))} />
                                </Route>

                                <Route path="/game/ladders">
                                    <IndexRoute component={Ladders}  {...this._title(__("Ladders"))} />

                                    <Route path="/game/ladders/:id" component={Ladder} />
                                </Route>

                                <Route path="/game/tournaments">
                                    <IndexRoute component={Tournaments} {...this._title(__("Tournaments"))} />
                                    <Route path="/game/tournaments/:id" component={Tournament} />

                                    <Route path="/game/tournaments/pairings/:id" component={TournamentPairing} {...this._title(__("Games"))} />
                                </Route>

                                <Route path="/game/alliance">
                                    <Route path="/game/alliance/create" component={CreateAlliance} {...this._title(__("Create Alliance"))} />
                                    <Route path="/game/alliance/admin" component={AllianceAdmin} {...this._title(__("Alliance Admin"))} />
                                    <Route path="/game/alliance/info" component={AllianceInfo} {...this._title(__("Alliance Info"))} />
                                    <Route path="/game/alliance/join" component={JoinAlliance} {...this._title(__("Join Alliance"))} />
                                </Route>

                                <Route path="/game/messages">
                                    <IndexRoute component={Messages}  {...this._title(__("Messages"))} />

                                    <Route path="/game/messages/compose(/:replyId)" component={Compose} />
                                    <Route path="/game/messages/:id" component={Message} />
                                </Route>

                                <Route path="/game/profile" component={UserProfile}  {...this._title(__("Your Profile"))} />

                            </Route>
                        </Route>

                        {/* play interface */}
                        <Route path="/play" component={PlayLayout}>
                            <Route path="/play/:id">
                                <IndexRoute component={Play} />

                                <Route path="/play/:id/history/:turn" component={Play} />
                            </Route>
                        </Route>
                    </Route>

                    <Route path="/toadmin" onEnter={this._onAdmin} />
                </Router>
            </Provider>
        );
    }

    /** Generate handler to update title when navigating to page */
    @autobind
    private _title(title: string): { onEnter: EnterHook } {
        return {
            onEnter: () => { this.props.store.dispatch(setTitle(title)); }
        };
    }

    /** Flow to navigate to MVC hosted admin page */
    @autobind
    private _onAdmin() {
        const { store } = this.props;

        const token = store.getState().session.data.access_token;

        // Move token to cookie
        document.cookie = `bearer_token=${token};path=/admin`;

        // Navigate to admin 
        window.location.href = baseUri + "admin/news";
    }

    private static _onRouteUpdate(app: App) {
        const state = (this as any).state.location.state;

        if (!state || !state.keepMessage) {
            app._clearMessage();
        }
    }

    private _clearMessage() {
        this.props.store.dispatch(clear(null));
    }
}
