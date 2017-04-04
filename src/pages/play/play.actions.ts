import { IAction, makePromiseAction, IAsyncActionVoid, IAsyncAction } from "../../lib/action";
import { PlayClient, GameActionResult, MoveOptions, AttackOptions, Game, GameClient, PlaceUnitsOptions } from "../../external/imperaClients";
import { getMapTemplate, MapTemplateCacheEntry } from "./mapTemplateCache";
import { NotificationType, INotification, IGameChatMessageNotification, IGameChatMessage } from "../../external/notificationModel";

export const SWITCH_GAME = "play-switch-game";
export interface ISwitchGamePayload {
    game: Game;
    mapTemplate: MapTemplateCacheEntry;
}
export const switchGame: IAsyncAction<number> = (gameId) =>
    (dispatch, getState, deps) => {
        const finish = () => ({
            type: SWITCH_GAME,
            payload: {
                promise: client.invoke("switchGame", oldGameId, gameId)
                    .then(() => deps.getCachedClient(GameClient)
                        .get(gameId)
                        .then(game => {
                            // deps.getCachedClient(GameClient).getMessages(gameId, false);
                            // deps.getCachedClient(GameClient).getMessages(gameId, true);

                            return getMapTemplate(game.mapTemplate)
                                .then(mapTemplate => ({
                                    game,
                                    mapTemplate
                                }));
                        })
                    )
            }
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

export const GAME_CHAT_MESSAGE = "play-game-chat-message";
export const gameChatMessage = (message: IGameChatMessage): IAction<IGameChatMessage> => ({
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
    };

export const TOGGLE_SIDEBAR = "play-toggle-sidebar";
export const toggleSidebar = (): IAction<void> => ({
    type: TOGGLE_SIDEBAR
});

export const PLACE = "play-place";
export const place = makePromiseAction<void, GameActionResult>((gameId, dispatch, getState, deps) => {
    const playState = getState().play.data;

    const options = Object.keys(playState.placeCountries).map(ci => ({
        countryIdentifier: ci,
        numberOfUnits: playState.placeCountries[ci]
    } as PlaceUnitsOptions));

    return {
        type: PLACE,
        payload: {
            promise: deps.getCachedClient(PlayClient).postPlace(playState.gameId, options)
        },
        options: {
            useMessage: true
        }
    };
});

export const EXCHANGE = "play-exchange";
export const exchange = makePromiseAction<void, GameActionResult>((gameId, dispatch, getState, deps) =>
    ({
        type: EXCHANGE,
        payload: {
            promise: deps.getCachedClient(PlayClient).postExchange(getState().play.data.gameId)
        },
        options: {
            useMessage: true
        }
    }));

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
    const playState = getState().play.data;

    return {
        type: ATTACK,
        payload: {
            promise: deps.getCachedClient(PlayClient).postAttack(playState.gameId, {
                originCountryIdentifier: playState.twoCountry.originCountryIdentifier,
                destinationCountryIdentifier: playState.twoCountry.destinationCountryIdentifier,
                numberOfUnits: playState.twoCountry.numberOfUnits
            })
        },
        options: {
            useMessage: true
        }
    };
});

export const END_ATTACK = "play-end-attack";
export const endAttack = makePromiseAction<void, GameActionResult>((_, dispatch, getState, deps) => {
    const playState = getState().play.data;

    return {
        type: END_ATTACK,
        payload: {
            promise: deps.getCachedClient(PlayClient).postEndAttack(playState.gameId)
        },
        options: {
            useMessage: true
        }
    };
});

export const MOVE = "play-move";
export const move = makePromiseAction<void, GameActionResult>((_, dispatch, getState, deps) => {
    const playState = getState().play.data;

    return {
        type: MOVE,
        payload: {
            promise: deps.getCachedClient(PlayClient).postMove(playState.gameId, {
                originCountryIdentifier: playState.twoCountry.originCountryIdentifier,
                destinationCountryIdentifier: playState.twoCountry.destinationCountryIdentifier,
                numberOfUnits: playState.twoCountry.numberOfUnits
            })
        },
        options: {
            useMessage: true
        }
    };
});

export const END_TURN = "play-end-turn";
export const endTurn = makePromiseAction<void, Game>((_, dispatch, getState, deps) => {
    const playState = getState().play.data;

    return {
        type: END_TURN,
        payload: {
            promise: deps.getCachedClient(PlayClient).postEndTurn(playState.gameId)
        },
        options: {
            useMessage: true
        }
    };
});