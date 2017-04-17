import { IAction, makePromiseAction } from "../../lib/action";
import { LadderSummary, LadderClient } from "../../external/imperaClients";
import { show, MessageType } from "../../common/message/message.actions";

export const REFRESH = "ladders-refresh";
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
export const join = makePromiseAction<string, null>((ladderId, dispatch, getState, deps) =>
    ({
        type: JOIN,
        payload: {
            promise: deps.getCachedClient(LadderClient).postJoin(ladderId).then(() => {
                // Refresh ladders after hiding
                dispatch(refresh(null));
                dispatch(show(__("Game joined, you can find it now in [My Games](/game/games)."), MessageType.success));
            })
        },
        options: {
            useMessage: true,
            clearMessage: true
        }
    }));
