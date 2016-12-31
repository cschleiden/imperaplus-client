import { IClient } from "../clients/clientFactory";
import { ISignalRClient } from "../clients/signalrFactory";
import { IState } from "../reducers";

export interface IAction<T> {
    type: string;
    payload?: T;
}

export interface IAsyncPayload<TResult, TData> {
    promise: Promise<TResult>;
    data?: TData;
}

export interface IPromiseAction<TResult, TData> extends IAction<IAsyncPayload<TResult, TData>> {
    meta?: any;

    options?: IApiActionOptions;
}

export const success = (type: string) => `${type}-success`;
export const failed = (type: string) => `${type}-failed`;
export const pending = (type: string) => `${type}-pending`;

export interface IApiActionOptions {
    useMessage?: boolean;

    beforeSuccess?: (dispatch) => void;
    afterSuccess?: (dispatch) => void;

    beforeError?: (dispatch) => void;
    afterError?: (dispatch) => void;
}

export interface IAsyncActionDependencies {
    getCachedClient: <TClient>(clientType: IClient<TClient>) => TClient;
    createClientWithToken: <TClient>(clientType: IClient<TClient>, token: string) => TClient;
    getSignalRClient: (hubName: string, options?) => ISignalRClient; 
}

export const makePromiseAction = <TInput, TResult>(
    action: (data: TInput, dispatch?, getState?: () => IState, deps?: IAsyncActionDependencies) => IPromiseAction<TResult, TInput>) => {
    return (data: TInput, options?: IApiActionOptions) => {
        return (dispatch: Function, getState: () => IState, deps: IAsyncActionDependencies) => {
            let asyncAction = action(data, dispatch, getState, deps);

            asyncAction.options = Object.assign({}, asyncAction.options, options);

            dispatch(asyncAction);
        };
    };
};

export interface IAsyncAction<TInput> {
    (data: TInput): (dispatch?, getState?: () => IState, deps?: IAsyncActionDependencies) => void;
}