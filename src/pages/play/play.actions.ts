import { push } from "react-router-redux";
import { Game, GameActionResult, GameChatMessage, GameClient, HistoryClient, HistoryTurn, PlaceUnitsOptions, PlayClient } from "../../external/imperaClients";
import { IGameChatMessageNotification, IGameNotification, INotification, NotificationType } from "../../external/notificationModel";
import { IAction, IApiActionOptions, IAsyncAction, IAsyncActionVoid, makePromiseAction } from "../../lib/action";
import { getMapTemplate, MapTemplateCacheEntry } from "./mapTemplateCache";
import { inputActive } from "./reducer/play.selectors";

//
//  General actions
//
export const SWITCH_GAME = "play-switch-game";
export interface ISwitchGamePayload {
    game: Game;
    mapTemplate: MapTemplateCacheEntry;
}
export interface ISwitchGameInput {
    gameId: number;
    turnNo?: number;
}
export const switchGame: IAsyncAction<ISwitchGameInput> = (input) =>
    (dispatch, getState, deps) => {
        const { gameId, turnNo } = input;

        const finish = () => ({
            type: SWITCH_GAME,
            payload: {
                promise: client.invoke("switchGame", oldGameId, gameId)
                    .then(() => deps.getCachedClient(GameClient)
                        .get(gameId)
                        .then(game => {
                            return getMapTemplate(game.mapTemplate)
                                .then(mapTemplate => ({
                                    game,
                                    mapTemplate
                                }));
                        })
                    )
            },
            options: {
                afterSuccess: (d) => {
                    // Retrieve game chat
                    d(gameChatMessages(gameId));

                    // Go to history, if requested
                    if (turnNo > 0) {
                        (dispatch as any)(historyTurn(turnNo));
                    }
                }
            } as IApiActionOptions
        });

        const client = deps.getSignalRClient("game");

        const oldGameId = getState().play.data.gameId;
        if (!oldGameId && !client.isConnected()) {
            client.detachAllHandlers();

            client.on("notification", (notification: INotification) => {
                if (notification.type === NotificationType.GameChatMessage) {
                    const gameChatNotification = notification as IGameChatMessageNotification;
                    const message = gameChatNotification.message;

                    dispatch(gameChatMessage(message));
                }

                if (notification.type === NotificationType.PlayerTurn) {
                    const turnNotification = notification as IGameNotification;

                    if (turnNotification.gameId === getState().play.data.gameId) {
                        (dispatch as any)(refreshGame(null));
                    }
                }
            });

            client.onInit(() => {
                return client.invoke("switchGame", oldGameId || 0, gameId).then(() => {
                    dispatch(finish());
                });
            });

            client.start();
        } else {
            dispatch(finish());
        }
    };

export const REFRESH_GAME = "play-game-refresh";
export const refreshGame = makePromiseAction<void, Game>((input, dispatch, getState, deps) => {
    const gameId = getState().play.data.gameId;

    if (!gameId) {
        throw new Error("Cannot refresh without game");
    }

    return {
        type: REFRESH_GAME,
        payload: {
            promise: deps.getCachedClient(GameClient).get(gameId)
        }
    };
});

export const GAME_CHAT_MESSAGES = "play-game-chat-messages";
export interface IGameChatMessagesPayload {
    gameId: number;
    all: GameChatMessage[];
    team: GameChatMessage[];
}
export const gameChatMessages = makePromiseAction<number, IGameChatMessagesPayload>((gameId, dispatch, getState, deps) => ({
    type: GAME_CHAT_MESSAGES,
    payload: {
        promise: Promise.all([
            deps.getCachedClient(GameClient).getMessages(gameId, false),
            deps.getCachedClient(GameClient).getMessages(gameId, true)
        ]).then(messages => {
            return {
                gameId,
                all: messages[1],
                team: messages[0]
            } as IGameChatMessagesPayload;
        })
    }
}));

export const GAME_CHAT_MESSAGE = "play-game-chat-message";
export const gameChatMessage = (message: GameChatMessage): IAction<GameChatMessage> => ({
    type: GAME_CHAT_MESSAGE,
    payload: message
});

export const GAME_CHAT_SEND_MESSAGE = "play-game-chat-send-message";
export interface IGameChatSendMessageInput {
    message: string;
    isPublic: boolean;
}
export const gameChatSendMessage = makePromiseAction<IGameChatSendMessageInput, void>((input, dispatch, getState, deps) => {
    const gameId = getState().play.data.gameId;
    const client = deps.getSignalRClient("game");

    return {
        type: GAME_CHAT_SEND_MESSAGE,
        payload: {
            promise: client.invoke<void>("sendGameMessage", gameId, input.message, input.isPublic)
        }
    };
});

export const LEAVE = "play-leave";
export const leave: IAsyncActionVoid = () =>
    (dispatch, getState, deps) => {
        // Stop notification hub
        let client = deps.getSignalRClient("notification");
        client.stop();

        dispatch(<IAction<void>>{
            type: LEAVE
        });

        dispatch(push("/game/games"));
    };

export const TOGGLE_SIDEBAR = "play-toggle-sidebar";
export const toggleSidebar = (): IAction<void> => ({
    type: TOGGLE_SIDEBAR
});

export const PLACE = "play-place";
export const place = makePromiseAction<void, GameActionResult>((gameId, dispatch, getState, deps) => {
    const state = getState();
    const playState = getState().play.data;
    if (!inputActive(state.play)) {
        return;
    }

    const options = Object.keys(playState.placeCountries).map(ci => ({
        countryIdentifier: ci,
        numberOfUnits: playState.placeCountries[ci]
    } as PlaceUnitsOptions));

    return {
        type: PLACE,
        payload: {
            promise: deps.getCachedClient(PlayClient).postPlace(playState.gameId, options)
        }
    };
});

//
// Play actions
//

export const EXCHANGE = "play-exchange";
export const exchange = makePromiseAction<void, GameActionResult>((gameId, dispatch, getState, deps) => {
    const state = getState();
    if (!inputActive(state.play)) {
        return;
    }

    return {
        type: EXCHANGE,
        payload: {
            promise: deps.getCachedClient(PlayClient).postExchange(getState().play.data.gameId)
        }
    };
});

export const SELECT_COUNTRY = "play-country-select";
export const selectCountry = (countryIdentifier: string): IAction<string> => ({
    type: SELECT_COUNTRY,
    payload: countryIdentifier
});

export const SET_PLACE_UNITS = "play-place-set-units";
export interface ISetPlaceUnitsPayload {
    countryIdentifier: string;
    units: number;
};
export const setPlaceUnits = (countryIdentifier: string, units: number): IAction<ISetPlaceUnitsPayload> => ({
    type: SET_PLACE_UNITS,
    payload: {
        countryIdentifier,
        units
    }
});

export const SET_ACTION_UNITS = "play-action-set-units";
export const setActionUnits = (units: number): IAction<number> => ({
    type: SET_ACTION_UNITS,
    payload: units
});

export const ATTACK = "play-attack";
export const attack = makePromiseAction<void, GameActionResult>((input, dispatch, getState, deps) => {
    const state = getState();
    const playState = getState().play.data;

    if (!inputActive(state.play)) {
        return;
    }

    return {
        type: ATTACK,
        payload: {
            promise: deps.getCachedClient(PlayClient).postAttack(playState.gameId, {
                originCountryIdentifier: playState.twoCountry.originCountryIdentifier,
                destinationCountryIdentifier: playState.twoCountry.destinationCountryIdentifier,
                numberOfUnits: playState.twoCountry.numberOfUnits
            })
        }
    };
});

export const END_ATTACK = "play-end-attack";
export const endAttack = makePromiseAction<void, GameActionResult>((_, dispatch, getState, deps) => {
    const state = getState();
    const playState = getState().play.data;

    if (!inputActive(state.play)) {
        return;
    }

    return {
        type: END_ATTACK,
        payload: {
            promise: deps.getCachedClient(PlayClient).postEndAttack(playState.gameId)
        }
    };
});

export const MOVE = "play-move";
export const move = makePromiseAction<void, GameActionResult>((_, dispatch, getState, deps) => {
    const state = getState();
    const playState = getState().play.data;

    if (!inputActive(state.play)) {
        return;
    }

    return {
        type: MOVE,
        payload: {
            promise: deps.getCachedClient(PlayClient).postMove(playState.gameId, {
                originCountryIdentifier: playState.twoCountry.originCountryIdentifier,
                destinationCountryIdentifier: playState.twoCountry.destinationCountryIdentifier,
                numberOfUnits: playState.twoCountry.numberOfUnits
            })
        }
    };
});

export const END_TURN = "play-end-turn";
export const endTurn = makePromiseAction<void, Game>((_, dispatch, getState, deps) => {
    const state = getState();
    const playState = getState().play.data;

    if (!inputActive(state.play)) {
        return;
    }

    return {
        type: END_TURN,
        payload: {
            promise: deps.getCachedClient(PlayClient).postEndTurn(playState.gameId)
        }
    };
});

//
// History actions
//
export const HISTORY_TURN = "play-history-turn";
export const historyTurn = makePromiseAction<number, HistoryTurn>((turnId, dispatch, getState, deps) => {
    const { gameId } = getState().play.data;

    dispatch(push(`/play/${gameId}/history/${turnId}`));

    return {
        type: HISTORY_TURN,
        payload: {
            promise: deps.getCachedClient(HistoryClient).getTurn(gameId, turnId)
        }
    };
});

export const HISTORY_EXIT = "play-history-exit";
export const historyExit: IAsyncAction<void> = () =>
    (dispatch, getState, deps) => {
        const gameId = getState().play.data.gameId;

        dispatch(push(`/play/${gameId}`));

        dispatch({
            type: HISTORY_EXIT,
            payload: null
        });
    };