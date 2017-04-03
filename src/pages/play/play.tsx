import "./play.scss";

import * as React from "react";

import { connect } from "react-redux";

import Header from "./components/header";
import Map from "./components/map";
import Sidebar from "./components/sidebar";
import { IState } from "../../reducers";
import { switchGame } from "./play.actions";
import { Game } from "../../external/imperaClients";
import { setDocumentTitle } from "../../lib/title";
import { css } from "../../lib/css";

interface IPlayProps {
    params: { id: number };

    game: Game;
    sidebarOpen: boolean;
}

interface IPlayDispatchProps {
    switchGame: (gameId: number) => void;
}

class Play extends React.Component<IPlayProps & IPlayDispatchProps, void> {
    componentDidMount() {
        const gameId = this.props.params.id;
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
        const { sidebarOpen, game } = this.props;

        return <div className="play-container">
            <div className="play-header-container">
                <Header />
            </div>

            <div className="play-sidebar-container">
                {sidebarOpen && <Sidebar game={game} />}
            </div>

            <div className={css("play-area", {
                "sidebar": sidebarOpen
            })}>
                <Map />
            </div>
        </div>;
    }
}

export default connect((state: IState, ownProps: IPlayProps) => {
    const playState = state.play.data;

    return {
        game: playState.game,
        sidebarOpen: playState.sidebarOpen
    };
}, (dispatch) => ({
    switchGame: (gameId: number) => dispatch(switchGame(gameId))
}))(Play);