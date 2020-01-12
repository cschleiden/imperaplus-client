import { MessageType, show } from "../../common/message/message.actions";
import { refreshNotifications } from "../../common/session/session.actions";
import { GameClient, GameSummary } from "../../external/imperaClients";
import { makePromiseAction } from "../../lib/action";

export const refresh = makePromiseAction<void, GameSummary[]>(
    "games-refresh",
    (input, dispatch, getState, deps) => ({
        payload: {
            promise: deps.getCachedClient(GameClient).getMy()
        },
        options: {
            useMessage: true,
            afterSuccess: () => {
                dispatch(refreshNotifications(null));
            }
        }
    })
);

export const refreshOpen = makePromiseAction<void, GameSummary[]>(
    "games-refresh-fun",
    (input, dispatch, getState, deps) => ({
        payload: {
            promise: deps.getCachedClient(GameClient).getAll()
        },
        options: {
            useMessage: true
        }
    })
);

export const hide = makePromiseAction(
    "games-hide",
    (gameId: number, dispatch, getState, deps) => ({
        payload: {
            promise: deps
                .getCachedClient(GameClient)
                .patchHide(gameId)
                .then<void>(() => {
                    // Refresh games after hiding
                    dispatch(refresh(null));
                })
        },
        options: {
            useMessage: true
        }
    })
);

export const hideAll = makePromiseAction(
    "games-hide-all",
    (_, dispatch, getState, deps) => ({
        payload: {
            promise: deps
                .getCachedClient(GameClient)
                .patchHideAll()
                .then<void>(() => {
                    // Refresh games after hiding
                    dispatch(refresh(null));
                })
        },
        options: {
            useMessage: true
        }
    })
);

export const surrender = makePromiseAction<number, GameSummary>(
    "game-surrender",
    (gameId, dispatch, getState, deps) => ({
        payload: {
            promise: deps.getCachedClient(GameClient).postSurrender(gameId)
        },
        options: {
            useMessage: true
        }
    })
);

export const leave = makePromiseAction<number, void>(
    "game-leave",
    (gameId, dispatch, getState, deps) => ({
        payload: {
            promise: deps
                .getCachedClient(GameClient)
                .postLeave(gameId)
                .then(() => {
                    // Refresh games after hiding
                    dispatch(hideAll(null));
                })
        },
        options: {
            useMessage: true
        }
    })
);

export const remove = makePromiseAction<number, void>(
    "game-remove",
    (gameId, dispatch, getState, deps) => ({
        payload: {
            promise: deps
                .getCachedClient(GameClient)
                .delete(gameId)
                .then(() => {
                    // Refresh games after hiding
                    dispatch(refresh(null));
                })
        },
        options: {
            useMessage: true
        }
    })
);

export const join = makePromiseAction<
    { gameId: number; password?: string },
    void
>("game-join", ({ gameId, password }, dispatch, getState, deps) => ({
    payload: {
        promise: deps
            .getCachedClient(GameClient)
            .postJoin(gameId, password || null)
            .then(() => {
                // Refresh games after hiding
                dispatch(refreshOpen(null));
                dispatch(
                    show(
                        __(
                            "Game joined, you can find it now in [My Games](/game/games)."
                        ),
                        MessageType.success
                    )
                );
            })
    },
    options: {
        useMessage: true,
        clearMessage: true
    }
}));
