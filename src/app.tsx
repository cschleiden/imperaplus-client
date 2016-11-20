import "./styles/index.scss";

import * as React from "react";
import * as Redux from "redux";
import { Provider } from "react-redux";

import { Router, Route, IndexRoute } from "react-router";

// Components
import MainLayout from "./components/layouts/main";
import PublicLayout from "./components/layouts/public";
import PublicNav from "./components/navigation/public";
import Game from "./components/navigation/game";
import Create from "./pages/create/create";
import { Home, SignupConfirmation, Login } from "./pages/public";
import Signup from "./pages/public/signup";

import { resetForm } from "./actions/forms";

export default class App extends React.Component<{ store, history }, void> {
    public render() {
        return <Provider store={this.props.store}>
            <Router history={this.props.history}>
                {/* main layout */}
                <Route component={MainLayout}>
                    {/* public */}
                    <Route path="/" components={{ nav: PublicNav, content: PublicLayout }}>
                        <IndexRoute component={Home} />

                        <Route path="/signup" component={Signup} />
                        <Route path="/signup/confirmation" component={SignupConfirmation} />

                        <Route path="login" component={Login} />
                    </Route>

                    {/* in game */}
                    <Route path="game" components={{ nav: Game, content: Home }}>

                    </Route>
                </Route>
            </Router>
        </Provider>;
    }
};