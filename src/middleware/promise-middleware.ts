import objectAssign = require("object-assign");

import { ErrorResponse } from "../external/imperaClients";
import { IPromiseAction, IAsyncPayload, success, pending, failed } from "../lib/action";
import { show, MessageType, clear } from "../common/message/message.actions";
import { ErrorCodes } from "../i18n/errorCodes";

export default function promiseMiddleware({ dispatch }) {
    return next => <TResult, TData>(action: IPromiseAction<TResult, TData>) => {
        // Check whether it's an async action with a promise
        if (!action || !action.payload || !isPromise(action.payload.promise)) {
            return next(action);
        }

        const { type, payload, meta, options } = action;
        const { promise, data } = payload;

        if (options.clearMessage) {
            dispatch(clear(null));
        }

        /**
         * Dispatch the pending action
         */
        dispatch(objectAssign({},
            { type: pending(type) },
            data ? { payload: data } : {},
            meta ? { meta } : {}
        ));

        /**
         * If successful, dispatch the fulfilled action, otherwise dispatch
         * rejected action.
         */
        return promise.then(
            result => {
                if (options && options.beforeSuccess) {
                    options.beforeSuccess(dispatch);
                }

                dispatch({
                    type: success(type),
                    payload: result,
                    meta,
                });

                if (options && options.afterSuccess) {
                    options.afterSuccess(dispatch);
                }
            },
            (error: ErrorResponse & Error) => {
                if (options && options.beforeError) {
                    options.beforeError(dispatch);
                }

                if (options && options.useMessage) {
                    // Dispatch generic message action
                    let message = ErrorCodes.errorMessage[error.error];
                    if (!message) {
                        message = error.error_Description || error.error || error.message;
                    }

                    dispatch(show(message, MessageType.error));
                } else {
                    dispatch({
                        type: failed(type),
                        payload: error,
                        meta,
                    });
                }

                if (options.afterError) {
                    options.afterError(dispatch);
                }
            }
        );
    };
}

function isPromise(x: any): boolean {
    return x && x.then && typeof x.then === "function";
}
