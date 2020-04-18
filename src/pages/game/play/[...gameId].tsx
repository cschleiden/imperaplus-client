import * as React from "react";
import { Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import Header from "../../../components/play/header";
import Map from "../../../components/play/map";
import Sidebar from "../../../components/play/sidebar";
import { getErrorMessage } from "../../../i18n/errorCodes";
import __ from "../../../i18n/i18n";
import {
    doSetGameOption,
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
        overrideGameUiOptions: state.play.overrideGameUiOptions,
    };
}

const Play: AppNextPage = () => {
    const { game, sidebarOpen, error, overrideGameUiOptions } = useAppSelector(
        selector
    );
    const dispatch = useDispatch<AppDispatch>();

    React.useEffect(() => {
        const onKeyDown = (evt: KeyboardEvent) => {
            if (
                evt.key === "Control" &&
                !overrideGameUiOptions.showTeamsOnMap
            ) {
                dispatch(doSetGameOption(true, "showTeamsOnMap", true));
            }
        };

        const onKeyUp = (evt: KeyboardEvent) => {
            if (evt.key === "Control") {
                dispatch(doSetGameOption(true, "showTeamsOnMap", false));
            }
        };

        document.body.addEventListener("keydown", onKeyDown, true);
        document.body.addEventListener("keyup", onKeyUp, true);

        return () => {
            document.body.removeEventListener("keydown", onKeyDown);
            document.body.removeEventListener("keyup", onKeyUp);
        };
    }, []);

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
                    <Alert bsStyle="danger">
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

    return {};
};

export default Play;
