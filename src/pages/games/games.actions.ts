import { IAction, makePromiseAction } from "../../lib/action";
import { getCachedClient } from "../../clients/clientFactory";
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
