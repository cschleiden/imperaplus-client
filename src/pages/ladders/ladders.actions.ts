import { MessageType, show } from "../../common/message/message.actions";
import {
    Ladder,
    LadderClient,
    LadderSummary
} from "../../external/imperaClients";
import { makePromiseAction } from "../../lib/action";

export const refresh = makePromiseAction<void, LadderSummary[]>(
    "ladders-refresh",
    (input, dispatch, getState, deps) => ({
        payload: {
            promise: deps.getCachedClient(LadderClient).getAll()
        },
        options: {
            useMessage: true
        }
    })
);

export const open = makePromiseAction<string, Ladder>(
    "ladders-show",
    (ladderId, dispatch, getState, deps) => ({
        payload: {
            promise: deps.getCachedClient(LadderClient).get(ladderId)
        }
    })
);

export const join = makePromiseAction<string, void>(
    "ladder-join",
    (ladderId, dispatch, getState, deps) => ({
        payload: {
            promise: deps
                .getCachedClient(LadderClient)
                .postJoin(ladderId)
                .then(() => {
                    // Refresh ladders after hiding
                    dispatch(refresh(null));
                    dispatch(
                        show(
                            __("You are now in the queue"),
                            MessageType.success
                        )
                    );
                })
        },
        options: {
            clearMessage: true
        }
    })
);

export const leave = makePromiseAction<string, void>(
    "ladder-leave",
    (ladderId, dispatch, getState, deps) => ({
        payload: {
            promise: deps
                .getCachedClient(LadderClient)
                .deleteJoin(ladderId)
                .then(() => {
                    // Refresh ladders after hiding
                    dispatch(refresh(null));
                    dispatch(
                        show(__("You have left the queue"), MessageType.success)
                    );
                })
        },
        options: {
            clearMessage: true
        }
    })
);
