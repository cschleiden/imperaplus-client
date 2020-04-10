import Router from "next/router";
import { GameClient } from "../../../../external/imperaClients";
import {
    IGameChatMessageNotification,
    IGameNotification,
    NotificationType,
} from "../../../../external/notificationModel";
import __ from "../../../../i18n/i18n";
import { notificationService } from "../../../../services/notificationService";
import { AppThunk } from "../../../../store";
import { withUserId } from "../../../../types";
import { setTitle } from "../../shared/general/general.slice";
import { getToken } from "../../shared/session/session.selectors";
import { refreshNotifications } from "../../shared/session/session.slice";
import { fetchMapTemplate } from "./mapTemplateCache";
import {
    gameChatMessage,
    gameChatMessages,
    historyExit,
    historyTurn,
    leave,
    refreshGame,
    setUIOption,
    switchGame,
} from "./play.slice";
import { IGameUIOptions } from "./play.slice.state";

export const doHistoryExit = (): AppThunk => async (dispatch, getState) => {
    const { gameId } = getState().play;
    dispatch(historyExit());

    Router.push(`/game/play/${gameId}`);
};

// TODO: Move this to another place?
let initialized = false;

export const initNotifications = (): AppThunk => async (
    dispatch,
    getState,
    extra
) => {
    // TODO: Should find a better place.. for now hook up event the first time we join a game
    if (!initialized) {
        initialized = true;

        console.trace("Attach handler");
        notificationService.attachHandler(
            NotificationType.GameChatMessage,
            (notification) => {
                const gameChatNotification = notification as IGameChatMessageNotification;
                const message = gameChatNotification.message;

                dispatch(gameChatMessage(message));
            }
        );

        notificationService.attachHandler(
            NotificationType.PlayerTurn,
            (notification) => {
                const turnNotification = notification as IGameNotification;

                if (turnNotification.gameId === getState().play.gameId) {
                    dispatch(refreshGame());
                }
            }
        );
    }
};

/**
 * Switch to a game, also used for displaying a game the first time
 */
export const doSwitchGame = (
    gameId: number,
    turnNo?: number
): AppThunk => async (dispatch, getState, extra) => {
    await dispatch(initNotifications());

    const game = await extra
        .createClient(getToken(getState()), GameClient)
        .get(gameId);
    const mapTemplate = await fetchMapTemplate(
        getToken(getState()),
        game.mapTemplate
    );

    const oldGameId = getState().play.gameId;
    await notificationService.switchGame(oldGameId || 0, gameId);

    dispatch(
        switchGame(
            withUserId(getState(), {
                game,
                mapTemplate,
            })
        )
    );

    dispatch(setTitle(`${__("Play")}: ${game.id} - ${game.name}`));

    await dispatch(gameChatMessages());

    // Go to history, if requested
    if (turnNo >= 0) {
        dispatch(historyTurn(turnNo));
    }
};

export const doLeave = (): AppThunk => async (dispatch, getState) => {
    // Stop notification hub
    const { gameId } = getState().play;

    await notificationService.leaveGame(gameId);
    await dispatch(refreshNotifications());

    dispatch(leave());

    Router.push("/game/games");
};

export const doSetGameOption = (
    temporary: boolean,
    name: keyof IGameUIOptions,
    value: boolean
): AppThunk => async (dispatch, getState) => {
    dispatch(
        setUIOption({
            temporary,
            name,
            value,
        })
    );

    // TODO: Persist sttings
    // localStorage.setItem("impera-options", JSON.stringify(getState().play.gameUiOptions));
};
