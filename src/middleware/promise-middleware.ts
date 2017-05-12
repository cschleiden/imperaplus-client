import { clear, MessageType, show } from "../common/message/message.actions";
import { ErrorResponse } from "../external/imperaClients";
import { ErrorCodes } from "../i18n/errorCodes";
import { failed, IApiActionOptions, IAsyncPayload, IPromiseAction, pending, success } from "../lib/action";

export default function promiseMiddleware({ dispatch }) {
    return next => <TResult, TData>(action: IPromiseAction<TResult, TData>) => {
        // Check whether it's an async action with a promise
        if (!action || !action.payload || !isPromise(action.payload.promise)) {
            return next(action);
        }

        const { type, payload } = action;
        const { promise, data } = payload;

        const options: IApiActionOptions = {
            // Default options
            useMessage: true,
            clearMessage: true,

            // Custom options
            ...action.options
        };

        if (options && options.clearMessage) {
            dispatch(clear(null));
        }

        const { customSuffix = "" } = options;

        /**
         * Dispatch the pending action
         */
        dispatch({
            type: pending(type, customSuffix),
            payload: data
        });

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
                    type: success(type, customSuffix),
                    payload: result
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
                }

                dispatch({
                    type: failed(type, customSuffix),
                    payload: error
                });

                if (options && options.afterError) {
                    options.afterError(dispatch);
                }
            }
        );
    };
}

function isPromise(x: any): boolean {
    return x && x.then && typeof x.then === "function";
}
