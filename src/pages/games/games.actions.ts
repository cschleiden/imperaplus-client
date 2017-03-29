import { IAction, makePromiseAction } from "../../lib/action";
import { GameSummary, GameClient } from "../../external/imperaClients";

export const REFRESH = "games-refresh";
export const refresh = makePromiseAction<void, GameSummary[]>((input, dispatch, getState, deps) =>
    ({
        type: REFRESH,
        payload: {
            promise: deps.getCachedClient(GameClient).getMy()
        },
        options: {
            useMessage: true
        }
    }));

export const HIDE = "games-hide";
export const hide = makePromiseAction<number, void>((gameId, dispatch, getState, deps) =>
    ({
        type: HIDE,
        payload: {
            promise: deps.getCachedClient(GameClient).patchHide(gameId).then<void>(() => {
                // Refresh games after hiding
                dispatch(refresh(null));
            })
        },
        options: {
            useMessage: true
        }
    }));

export const HIDE_ALL = "games-hide-all";
export const hideAll = makePromiseAction<void, void>((input, dispatch, getState, deps) =>
    ({
        type: HIDE_ALL,
        payload: {
            promise: deps.getCachedClient(GameClient).patchHideAll().then<void>(() => {
                // Refresh games after hiding
                dispatch(refresh(null));
            })
        },
        options: {
            useMessage: true
        }
    }));

export const SURRENDER = "game-surrender";
export const surrender = makePromiseAction<number, GameSummary>((gameId, dispatch, getState, deps) =>
    ({
        type: SURRENDER,
        payload: {
            promise: deps.getCachedClient(GameClient).postSurrender(gameId)
        },
        options: {
            useMessage: true
        }
    }));

export const LEAVE = "game-leave";
export const leave = makePromiseAction<number, GameSummary>((gameId, dispatch, getState, deps) =>
    ({
        type: LEAVE,
        payload: {
            promise: deps.getCachedClient(GameClient).postLeave(gameId)
        },
        options: {
            useMessage: true
        }
    }));

export const REMOVE = "game-remove";
export const remove = makePromiseAction<number, GameSummary>((gameId, dispatch, getState, deps) =>
    ({
        type: SURRENDER,
        payload: {
            promise: deps.getCachedClient(GameClient).delete(gameId)
        },
        options: {
            useMessage: true
        }
    }));


export const JOIN = "game-join";
export const join = makePromiseAction<number, GameSummary>((gameId, dispatch, getState, deps) =>
    ({
        type: SURRENDER,
        payload: {
            promise: deps.getCachedClient(GameClient).postJoin(gameId)
        },
        options: {
            useMessage: true
        }
    }));