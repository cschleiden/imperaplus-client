import "./play.scss";

import * as React from "react";
import { connect } from "react-redux";
import { Alert } from "react-bootstrap";

import Header from "./components/header";
import Map from "./components/map";
import Sidebar from "./components/sidebar";
import { IState } from "../../reducers";
import { switchGame, refreshGame } from "./play.actions";
import { Game, ErrorResponse } from "../../external/imperaClients";
import { setDocumentTitle } from "../../lib/title";
import { css } from "../../lib/css";
import { autobind } from "../../lib/autobind";
import { ErrorCodes } from "../../i18n/errorCodes";

interface IPlayProps {
    params: { id: string };

    game: Game;
    error: ErrorResponse;
    sidebarOpen: boolean;
}

interface IPlayDispatchProps {
    switchGame: (gameId: number) => void;
    refreshGame: () => void;
}

class Play extends React.Component<IPlayProps & IPlayDispatchProps, void> {
    componentDidMount() {
        const gameId = parseInt(this.props.params.id, 10);
        if (!gameId) {
            alert("");
        }

        this.props.switchGame(gameId);

        this._setGameTitle(this.props);
    }

    componentWillReceiveProps(props: IPlayProps & IPlayDispatchProps) {
        this._setGameTitle(props);
    }

    private _setGameTitle(props: IPlayProps) {
        const { game } = props;

        let title = __("Play");
        if (game) {
            title += `: ${game.id} - ${game.name}`;
        }

        setDocumentTitle(title);
    }

    render() {
        const { sidebarOpen, error } = this.props;

        return <div className="play-container">
            <div className="play-header-container">
                <Header />
            </div>

            <div className="play-sidebar-container">
                {sidebarOpen && <Sidebar />}
            </div>

            <div className={css("play-area", {
                "sidebar": sidebarOpen
            })}>
                {error && <Alert
                    bsStyle="danger"
                    onDismiss={this._clearError}>
                    {ErrorCodes.errorMessage[error.error] || error.error_Description || __("An error occured, please refresh.")}
                </Alert>}

                <Map />
            </div>
        </div>;
    }

    @autobind
    private _clearError() {
        this.props.refreshGame();
    }
}

export default connect((state: IState, ownProps: IPlayProps) => {
    const playState = state.play.data;

    return {
        game: playState.game,
        error: playState.error,
        sidebarOpen: playState.sidebarOpen
    };
}, (dispatch) => ({
    switchGame: (gameId: number) => dispatch(switchGame(gameId)),
    refreshGame: () => dispatch(refreshGame(null))
}))(Play);