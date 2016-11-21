import objectAssign = require("object-assign");

import { MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import { ErrorResponse } from "../external/imperaClients";
import { IAsyncAction, IAsyncPayload, success, pending, failed } from "../actions/action";
import { show } from "../actions/message";
import { ErrorCodes } from "../i18n/errorCodes";

export default function promiseMiddleware({ dispatch }) {
    return next => <TResult, TData>(action: IAsyncAction<TResult, TData>) => {
        // Check whether it's an async action
        if (!action || !action.payload || !isPromise(action.payload.promise)) {
            return next(action);
        }

        const { type, payload, meta, options } = action;
        const { promise, data } = payload;

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
            (error: ErrorResponse) => {
                if (options && options.beforeError) {
                    options.beforeError(dispatch);
                }

                if (options && options.useMessage) {
                    // Dispatch generic message action
                    let message = ErrorCodes.errorMessage[error.error];
                    if (!message) {
                        message = error.error_Description || error.error;
                    }

                    dispatch(show(message, MessageBarType.error));
                } else {
                    dispatch({
                        type: failed(type),
                        payload: error,
                        meta,
                    });
                }
            }
        );
    };
}

function isPromise(x: any): boolean {
    return x && x.then && typeof x.then === "function";
}