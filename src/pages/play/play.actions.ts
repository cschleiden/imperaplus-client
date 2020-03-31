import { push } from "react-router-redux";
import { refreshNotifications } from "../../common/session/session.actions";
import {
    Game,
    GameActionResult,
    GameChatMessage,
    GameClient,
    GameSummary,
    HistoryClient,
    HistoryTurn,
    PlaceUnitsOptions,
    PlayClient,
} from "../../external/imperaClients";
import {
    IGameChatMessageNotification,
    IGameNotification,
    NotificationType,
} from "../../external/notificationModel";
import {
    IAction,
    IApiActionOptions,
    IAsyncAction,
    IAsyncActionVoid,
    makePromiseAction,
} from "../../lib/action";
import { setDocumentTitle } from "../../lib/title";
import { NotificationService } from "../../services/notificationService";
import { MapTemplateCacheEntry, getMapTemplate } from "./mapTemplateCache";
import { IGameUIOptions } from "./reducer/play.reducer.state";
import {
    canMoveOrAttack,
    canPlace,
    inputActive,
} from "./reducer/play.selectors";

// TODO: Move this to another place?
let initialized = false;

//
//  General actions
//

/**
 * Refresh other games it's the current player's turn
 */
export const refreshOtherGames = makePromiseAction<void, GameSummary[]>(
    "play-other-games-refresh",
    (input, dispatch, getState, deps) => {
        return {
            payload: {
                promise: deps.getCachedClient(GameClient).getMyTurn(),
            },
        };
    }
);

export const SWITCH_GAME = "play-switch-game";
export interface ISwitchGamePayload {
    game: Game;
    mapTemplate: MapTemplateCacheEntry;
}
export interface ISwitchGameInput {
    gameId: number;
    turnNo?: number;
}

/**
 * Switch to a game, also used for displaying a game the first time
 */
export const switchGame: IAsyncAction<ISwitchGameInput> = (input) => (
    dispatch,
    getState,
    deps
) => {
    const { gameId, turnNo } = input;

    const client = NotificationService.getInstance();

    // TODO: Should find a better place.. for now hook up event the first time we join a game
    if (!initialized) {
        initialized = true;

        client.attachHandler(
            NotificationType.GameChatMessage,
            (notification) => {
                const gameChatNotification = notification as IGameChatMessageNotification;
                const message = gameChatNotification.message;

                dispatch(gameChatMessage(message));
            }
        );

        client.attachHandler(NotificationType.PlayerTurn, (notification) => {
            const turnNotification = notification as IGameNotification;

            if (turnNotification.gameId === getState().play.gameId) {
                (dispatch as any)(refreshGame(null));
            }
        });
    }

    const oldGameId = getState().play.gameId;
    client.switchGame(oldGameId || 0, gameId).then(() => {
        dispatch({
            type: SWITCH_GAME,
            payload: {
                promise: deps
                    .getCachedClient(GameClient)
                    .get(gameId)
                    .then((game) => {
                        return getMapTemplate(game.mapTemplate).then(
                            (mapTemplate) => ({
                                game,
                                mapTemplate,
                            })
                        );
                    }),
            },
            options: {
                afterSuccess: (d) => {
                    // Update title
                    const { game } = getState().play;
                    setDocumentTitle(
                        `${__("Play")}: ${game.id} - ${game.name}`
                    );

                    // Retrieve game chat
                    d(gameChatMessages(gameId));

                    // Go to history, if requested
                    if (turnNo >= 0) {
                        d(historyTurn(turnNo));
                    }
                },
            } as IApiActionOptions,
        });
    });
};

export const refreshGame = makePromiseAction<void, Game>(
    "play-game-refresh",
    (input, dispatch, getState, deps) => {
        const gameId = getState().play.gameId;

        if (!gameId) {
            throw new Error("Cannot refresh without game");
        }

        return {
            payload: {
                promise: deps.getCachedClient(GameClient).get(gameId),
            },
        };
    }
);

export interface IGameChatMessagesPayload {
    gameId: number;
    all: GameChatMessage[];
    team: GameChatMessage[];
}
export const gameChatMessages = makePromiseAction<
    number,
    IGameChatMessagesPayload
>("play-game-chat-messages", (gameId, dispatch, getState, deps) => ({
    payload: {
        promise: Promise.all([
            deps.getCachedClient(GameClient).getMessages(gameId, false),
            deps.getCachedClient(GameClient).getMessages(gameId, true),
        ]).then((messages) => {
            return {
                gameId,
                all: messages[1],
                team: messages[0],
            } as IGameChatMessagesPayload;
        }),
    },
}));

export const GAME_CHAT_MESSAGE = "play-game-chat-message";
export const gameChatMessage = (
    message: GameChatMessage
): IAction<GameChatMessage> => ({
    type: GAME_CHAT_MESSAGE,
    payload: message,
});

export interface IGameChatSendMessageInput {
    message: string;
    isPublic: boolean;
}
export const gameChatSendMessage = makePromiseAction(
    "play-game-chat-send-message",
    (input: IGameChatSendMessageInput, dispatch, getState, deps) => {
        const gameId = getState().play.gameId;

        return {
            payload: {
                promise: NotificationService.getInstance().sendGameMessage(
                    gameId,
                    input.message,
                    input.isPublic
                ),
            },
            options: {
                // Prevent loading bar from picking this up
                customSuffix: "-chat",
            },
        };
    }
);

export const LEAVE = "play-leave";
export const leave: IAsyncActionVoid = () => (dispatch, getState, deps) => {
    // Stop notification hub
    const gameId = getState().play.gameId;
    NotificationService.getInstance().leaveGame(gameId);

    dispatch(refreshNotifications(null));

    dispatch(<IAction<void>>{
        type: LEAVE,
    });

    dispatch(push("/game/games"));
};

export const TOGGLE_SIDEBAR = "play-toggle-sidebar";
export const toggleSidebar: IAsyncAction<void> = () => (
    dispatch,
    getState,
    deps
) => {
    const sidebarOpen = getState().play.sidebarOpen;
    localStorage.setItem("impera-sidebar", (!sidebarOpen).toString());

    dispatch({
        type: TOGGLE_SIDEBAR,
    });
};

export interface ISetGameOptionPayload {
    name: keyof IGameUIOptions;
    value: boolean;
    temporary?: boolean;
}
export const SET_GAME_OPTION = "play-set-game-option";
export const setGameOption: IAsyncAction<ISetGameOptionPayload> = (payload) => (
    dispatch,
    getState
) => {
    const state = getState().play;
    const data = payload.temporary
        ? state.overrideGameUiOptions
        : state.gameUiOptions;
    if (data[payload.name] === payload.value) {
        return;
    }

    dispatch({
        type: SET_GAME_OPTION,
        payload: payload,
    } as IAction<ISetGameOptionPayload>);

    localStorage.setItem(
        "impera-options",
        JSON.stringify(getState().play.gameUiOptions)
    );
};

//
// Play actions
//

export const place = makePromiseAction<void, GameActionResult>(
    "play-place",
    (gameId, dispatch, getState, deps) => {
        const state = getState();
        const playState = getState().play;
        if (!inputActive(state.play)) {
            return;
        }

        if (!canPlace(state.play)) {
            return;
        }

        const options = Object.keys(playState.placeCountries)
            .map((ci) => ({
                key: ci,
                units: playState.placeCountries[ci],
            }))
            .filter((x) => x.units > 0)
            .map(
                (x) =>
                    ({
                        countryIdentifier: x.key,
                        numberOfUnits: x.units,
                    } as PlaceUnitsOptions)
            );

        return {
            payload: {
                promise: deps
                    .getCachedClient(PlayClient)
                    .postPlace(playState.gameId, options),
            },
        };
    }
);

export const exchange = makePromiseAction<void, GameActionResult>(
    "play-exchange",
    (gameId, dispatch, getState, deps) => {
        const state = getState();
        if (!inputActive(state.play)) {
            return;
        }

        return {
            payload: {
                promise: deps
                    .getCachedClient(PlayClient)
                    .postExchange(getState().play.gameId),
            },
        };
    }
);

export const SELECT_COUNTRY = "play-country-select";
export const selectCountry = (countryIdentifier: string): IAction<string> => ({
    type: SELECT_COUNTRY,
    payload: countryIdentifier,
});

export const SET_PLACE_UNITS = "play-place-set-units";
export interface ISetPlaceUnitsPayload {
    countryIdentifier: string;
    units: number;
}
export const setPlaceUnits = (
    countryIdentifier: string,
    units: number
): IAction<ISetPlaceUnitsPayload> => ({
    type: SET_PLACE_UNITS,
    payload: {
        countryIdentifier,
        units,
    },
});

export const SET_ACTION_UNITS = "play-action-set-units";
export const setActionUnits = (units: number): IAction<number> => ({
    type: SET_ACTION_UNITS,
    payload: units,
});

export const attack = makePromiseAction<void, GameActionResult>(
    "play-attack",
    (input, dispatch, getState, deps) => {
        const state = getState();
        const playState = getState().play;

        if (!inputActive(state.play)) {
            return;
        }

        if (!canMoveOrAttack(state.play)) {
            return;
        }

        return {
            payload: {
                promise: deps
                    .getCachedClient(PlayClient)
                    .postAttack(playState.gameId, {
                        originCountryIdentifier:
                            playState.twoCountry.originCountryIdentifier,
                        destinationCountryIdentifier:
                            playState.twoCountry.destinationCountryIdentifier,
                        numberOfUnits: playState.twoCountry.numberOfUnits,
                    }),
            },
        };
    }
);

export const endAttack = makePromiseAction<void, GameActionResult>(
    "play-end-attack",
    (_, dispatch, getState, deps) => {
        const state = getState();
        const playState = getState().play;

        if (!inputActive(state.play)) {
            return;
        }

        return {
            payload: {
                promise: deps
                    .getCachedClient(PlayClient)
                    .postEndAttack(playState.gameId),
            },
        };
    }
);

export const move = makePromiseAction<void, GameActionResult>(
    "play-move",
    (_, dispatch, getState, deps) => {
        const state = getState();
        const playState = getState().play;

        if (!inputActive(state.play)) {
            return;
        }

        if (!canMoveOrAttack(state.play)) {
            return;
        }

        return {
            payload: {
                promise: deps
                    .getCachedClient(PlayClient)
                    .postMove(playState.gameId, {
                        originCountryIdentifier:
                            playState.twoCountry.originCountryIdentifier,
                        destinationCountryIdentifier:
                            playState.twoCountry.destinationCountryIdentifier,
                        numberOfUnits: playState.twoCountry.numberOfUnits,
                    }),
            },
        };
    }
);

export const endTurn = makePromiseAction<void, Game>(
    "play-end-turn",
    (_, dispatch, getState, deps) => {
        const state = getState();
        const playState = getState().play;

        if (!inputActive(state.play)) {
            return;
        }

        return {
            payload: {
                promise: deps
                    .getCachedClient(PlayClient)
                    .postEndTurn(playState.gameId),
            },
            options: {
                afterSuccess: () => dispatch(refreshOtherGames(null)),
            },
        };
    }
);

//
// History actions
//
export const historyTurn = makePromiseAction<number, HistoryTurn>(
    "play-history-turn",
    (turnId, dispatch, getState, deps) => {
        const { gameId } = getState().play;

        dispatch(push(`/play/${gameId}/history/${turnId}`));

        return {
            payload: {
                promise: deps
                    .getCachedClient(HistoryClient)
                    .getTurn(gameId, turnId),
            },
        };
    }
);

export const HISTORY_EXIT = "play-history-exit";
export const historyExit: IAsyncAction<void> = () => (
    dispatch,
    getState,
    deps
) => {
    const gameId = getState().play.gameId;

    dispatch(push(`/play/${gameId}`));

    dispatch({
        type: HISTORY_EXIT,
        payload: null,
    });
};
