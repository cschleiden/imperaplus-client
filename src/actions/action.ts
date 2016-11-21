export interface IAction<T> {
    type: string;
    payload?: T;
}

export interface IAsyncPayload<TResult, TData> {
    promise: Promise<TResult>;
    data?: TData;
}

export interface IAsyncAction<TResult, TData> extends IAction<IAsyncPayload<TResult, TData>> {
    meta?: any;

    options?: IAsyncActionOptions;
}

export const success = (type: string) => `${type}-success`;
export const failed = (type: string) => `${type}-failed`;
export const pending = (type: string) => `${type}-pending`;

export interface IAsyncActionOptions {
    useMessage?: boolean;

    beforeSuccess?: (dispatch) => void;
    afterSuccess?: (dispatch) => void;

    beforeError?: (dispatch) => void;
    afterError?: (dispatch) => void;
}

export const makeAsyncAction = <TInput, TResult>(
    action: (data: TInput, dispatch?) => IAsyncAction<TResult, TInput>) => {
    return (data: TInput, options?: IAsyncActionOptions) => {
        return (dispatch: Function, getState: Function) => {
            let asyncAction = action(data, dispatch);

            asyncAction.options = Object.assign({}, asyncAction.options, options);

            dispatch(asyncAction);
        };
    };
};
