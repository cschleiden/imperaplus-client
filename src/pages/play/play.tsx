import "./play.scss";

import * as React from "react";
import { Alert } from "react-bootstrap";
import { connect } from "react-redux";

import { ErrorResponse, Game } from "../../external/imperaClients";
import { ErrorCodes } from "../../i18n/errorCodes";
import { autobind } from "../../lib/autobind";
import { css } from "../../lib/css";
import { setDocumentTitle } from "../../lib/title";
import { IState } from "../../reducers";
import Header from "./components/header";
import Map from "./components/map";
import Sidebar from "./components/sidebar";
import { refreshGame, switchGame, refreshOtherGames, setGameOption } from "./play.actions";
import { IGameUIOptions } from "./reducer/play.reducer.state";

interface IPlayProps {
    params: {
        id: string;
        turn: string;
    };

    game: Game;
    error: ErrorResponse;
    sidebarOpen: boolean;
}

interface IPlayDispatchProps {
    switchGame: (gameId: number, turnNo?: number) => void;
    refreshGame: () => void;
    refreshOtherGames: () => void;

    setGameUiOption: (name: keyof IGameUIOptions, value: boolean) => void;
}

class Play extends React.Component<IPlayProps & IPlayDispatchProps> {
    componentDidMount() {
        const gameId = this._getGameIdFromProps(this.props);
        const turnNo = parseInt(this.props.params.turn, 10);

        this.props.switchGame(gameId, turnNo);
        this.props.refreshOtherGames();

        document.body.addEventListener("keydown", this._onKeyDown, true);
        document.body.addEventListener("keyup", this._onKeyUp, true);
    }

    componentWillUnmount() {
        document.body.removeEventListener("keydown", this._onKeyDown);
        document.body.removeEventListener("keyup", this._onKeyUp);
    }

    componentWillReceiveProps(nextProps: IPlayProps & IPlayDispatchProps) {
        const currentGameId = this._getGameIdFromProps(this.props);
        const newGameId = this._getGameIdFromProps(nextProps);
        const turnNo = parseInt(nextProps.params.turn, 10);

        if (currentGameId !== newGameId) {
            this.props.switchGame(newGameId, turnNo);
        } /* else if (turnNo >= 0 && this.props.params.turn !== nextProps.params.turn) {
            this.props.switchGame(currentGameId, turnNo);
        } */
    }

    private _getGameIdFromProps(props: IPlayProps) {
        const gameId = parseInt(props.params.id, 10);
        if (!gameId) {
            throw new Error("Game id is required");
        }

        return gameId;
    }

    render() {
        const { game, sidebarOpen, error } = this.props;

        if (!game) {
            // TODO: Loading indicator?
            return null;
        }

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

    @autobind
    private _onKeyDown(evt: KeyboardEvent) {
        if (evt.key === "Control") {
            this.props.setGameUiOption("showTeamsOnMap", true);
        }
    }

    @autobind
    private _onKeyUp(evt: KeyboardEvent) {
        if (evt.key === "Control") {
            this.props.setGameUiOption("showTeamsOnMap", false);
        }
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
    switchGame: (gameId: number, turnNo?: number) => { dispatch(switchGame({ gameId, turnNo })); },
    refreshGame: () => { dispatch(refreshGame(null)); },
    refreshOtherGames: () => { dispatch(refreshOtherGames(null)); },

    setGameUiOption: (name: keyof IGameUIOptions, value: boolean) => {
        dispatch(setGameOption({
            name,
            value,
            temporary: true
        }));
    }
}))(Play);