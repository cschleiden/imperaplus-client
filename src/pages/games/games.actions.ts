import { IAction, makePromiseAction } from "../../lib/action";
import { GameSummary, GameClient } from "../../external/imperaClients";
import { show, MessageType } from "../../common/message/message.actions";

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

export const REFRESH_FUN = "games-refresh";
export const refreshFun = makePromiseAction<void, GameSummary[]>((input, dispatch, getState, deps) =>
    ({
        type: REFRESH_FUN,
        payload: {
            promise: deps.getCachedClient(GameClient).getAll()
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
export const leave = makePromiseAction<number, null>((gameId, dispatch, getState, deps) =>
    ({
        type: LEAVE,
        payload: {
            promise: deps.getCachedClient(GameClient).postLeave(gameId).then(() => {
                // Refresh games after hiding
                dispatch(hideAll(null));
            })
        },
        options: {
            useMessage: true
        }
    }));

export const REMOVE = "game-remove";
export const remove = makePromiseAction<number, null>((gameId, dispatch, getState, deps) =>
    ({
        type: REMOVE,
        payload: {
            promise: deps.getCachedClient(GameClient).delete(gameId).then(() => {
                // Refresh games after hiding
                dispatch(refresh(null));
            })
        },
        options: {
            useMessage: true
        }
    }));


export const JOIN = "game-join";
export const join = makePromiseAction<number, null>((gameId, dispatch, getState, deps) =>
    ({
        type: JOIN,
        payload: {
            promise: deps.getCachedClient(GameClient).postJoin(gameId).then(() => {
                // Refresh games after hiding
                dispatch(refreshFun(null));
                dispatch(show(__("Game created, you can find it now in [My Games](/game/games)."), MessageType.success));
            })
        },
        options: {
            useMessage: true,
            clearMessage: true
        }
    }));
