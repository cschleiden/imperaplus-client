import { IAction, makePromiseAction } from "../../lib/action";
import { LadderSummary, LadderClient } from "../../external/imperaClients";

export const REFRESH = "ladder-refresh";
export const refresh = makePromiseAction<void, LadderSummary[]>((input, dispatch, getState, deps) =>
    ({
        type: REFRESH,
        payload: {
            promise: deps.getCachedClient(LadderClient).getAll()
        },
        options: {
            useMessage: true
        }

    }));

export const JOIN = "ladder-join";
export const join = makePromiseAction<string, LadderSummary>((ladderId, dispatch, getState, deps) =>
    ({
        type: JOIN,
        payload: {
            promise: deps.getCachedClient(LadderClient).postJoin(ladderId).then(() => {
                // Refresh games after hiding
                dispatch(refresh(null));
            })
        },
        options: {
            useMessage: true
        }
    }));
