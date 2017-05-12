import { MessageType, show } from "../../common/message/message.actions";
import { LadderClient, LadderSummary } from "../../external/imperaClients";
import { IAction, makePromiseAction } from "../../lib/action";

export const refresh = makePromiseAction<void, LadderSummary[]>(
    "ladders-refresh", (input, dispatch, getState, deps) =>
        ({
            payload: {
                promise: deps.getCachedClient(LadderClient).getAll()
            },
            options: {
                useMessage: true
            }
        }));


export const join = makePromiseAction<string, null>(
    "ladder-join", (ladderId, dispatch, getState, deps) =>
        ({
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
