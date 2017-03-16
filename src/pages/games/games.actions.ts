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

export const HIDE_ALL = "games-hide-all";
export const hideAll = makePromiseAction<void, void>((input, dispatch, getState, deps) =>
    ({
        type: REFRESH,
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