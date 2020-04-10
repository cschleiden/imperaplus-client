import * as React from "react";
import { Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import Header from "../../../components/play/header";
import Map from "../../../components/play/map";
import Sidebar from "../../../components/play/sidebar";
import { getErrorMessage } from "../../../i18n/errorCodes";
import __ from "../../../i18n/i18n";
import {
    doSwitchGame,
    initNotifications,
} from "../../../lib/domain/game/play/play.actions";
import { css } from "../../../lib/utils/css";
import { IState } from "../../../reducers";
import { AppDispatch, AppNextPage, useAppSelector } from "../../../store";
import style from "./play.module.scss";

function selector(state: IState) {
    return {
        game: state.play.game,
        error: state.play.error,
        sidebarOpen: state.play.sidebarOpen,
    };
}

const Play: AppNextPage<ReturnType<typeof selector>> = (props) => {
    // componentDidMount() {
    //     const gameId = this._getGameIdFromProps(this.props);
    //     const turnNo = parseInt(this.props.params.turn, 10);

    //     this.props.switchGame(gameId, turnNo);
    //     this.props.refreshOtherGames();

    //     document.body.addEventListener("keydown", this._onKeyDown, true);
    //     document.body.addEventListener("keyup", this._onKeyUp, true);
    // }

    // componentWillUnmount() {
    //     document.body.removeEventListener("keydown", this._onKeyDown);
    //     document.body.removeEventListener("keyup", this._onKeyUp);
    // }

    // componentWillReceiveProps(nextProps: IPlayProps & IPlayDispatchProps) {
    //     const currentGameId = this._getGameIdFromProps(this.props);
    //     const newGameId = this._getGameIdFromProps(nextProps);
    //     const turnNo = parseInt(nextProps.params.turn, 10);

    //     if (currentGameId !== newGameId) {
    //         this.props.switchGame(newGameId, turnNo);
    //     } /* else if (turnNo >= 0 && this.props.params.turn !== nextProps.params.turn) {
    //         this.props.switchGame(currentGameId, turnNo);
    //     } */
    // }

    const { game, sidebarOpen, error } = useAppSelector(selector);
    const dispatch = useDispatch<AppDispatch>();

    // Ensure notifications are setup after SSR
    dispatch(initNotifications());

    if (!game) {
        // TODO: Loading indicator?
        return null;
    }

    return (
        <div className={style.playContainer}>
            <div className={style.playHeaderContainer}>
                <Header />
            </div>

            <div className={style.playSidebarContainer}>
                {sidebarOpen && <Sidebar />}
            </div>

            <div
                className={css(style.playArea, {
                    [style.playSidebar]: sidebarOpen,
                })}
            >
                {error && (
                    <Alert bsStyle="danger" onDismiss={this._clearError}>
                        {getErrorMessage(error.error) ||
                            error.error_Description ||
                            __("An error occured, please refresh.")}
                    </Alert>
                )}

                <Map />
            </div>
        </div>
    );
};

// private _clearError = () => {
//     this.props.refreshGame();
// };

// private _onKeyDown = (evt: KeyboardEvent) => {
//     if (evt.key === "Control") {
//         this.props.setGameUiOption("showTeamsOnMap", true);
//     }
// };

// private _onKeyUp = (evt: KeyboardEvent) => {
//     if (evt.key === "Control") {
//         this.props.setGameUiOption("showTeamsOnMap", false);
//     }
// };

Play.needsLogin = true;
Play.getTitle = (state) => __("Play"); // TODO
Play.getInitialProps = async (ctx) => {
    let gameId: number | undefined;
    let historyTurn: number | undefined;
    if (Array.isArray(ctx.query.gameId)) {
        gameId = parseInt(ctx.query.gameId[0], 10);
        historyTurn = parseInt(ctx.query.gameId[2], 10);
    } else {
        gameId = parseInt(ctx.query.gameId[0], 10);
    }

    console.info(`Switching game ${ctx.query.gameId}`);
    await ctx.store.dispatch(doSwitchGame(gameId, historyTurn));

    return selector(ctx.store.getState());
};

// export default connect(
//     (state: IState, ownProps: IPlayProps) => {
//         const playState = state.play;

//         return {
//             game: playState.game,
//             error: playState.error,
//             sidebarOpen: playState.sidebarOpen,
//         };
//     },
//     (dispatch) => ({
//         switchGame: (gameId: number, turnNo?: number) => {
//             dispatch(switchGame({ gameId, turnNo }));
//         },
//         refreshGame: () => {
//             dispatch(refreshGame(null));
//         },
//         refreshOtherGames: () => {
//             dispatch(refreshOtherGames(null));
//         },

//         setGameUiOption: (name: keyof IGameUIOptions, value: boolean) => {
//             dispatch(
//                 setGameOption({
//                     name,
//                     value,
//                     temporary: true,
//                 })
//             );
//         },
//     })
// )(Play);

export default Play;
