import { Dispatch } from "react-redux";
import { IClient } from "../clients/clientFactory";
import { ISignalRClient } from "../clients/signalrFactory";
import { IState } from "../reducers";
import { NotificationService } from "../services/notificationService";

export interface IAction<T> {
    type: string;
    payload?: T;
}

/*
export const makeAction = <T>(type: string, creator: (...args) => T) => {
    return (...args) => ({
        TYPE: type,
        payload: creator(args)
    });
};
*/

export interface IAsyncPayload<TResult, TData> {
    promise: Promise<TResult>;
    data?: TData;
}

export interface IPromiseAction<TResult, TData> extends IAction<IAsyncPayload<TResult, TData>> {
    options?: IApiActionOptions;
}

export const success = (type: string, suffix?: string) => `${type}-success${suffix && `-${suffix}` || ""}`;
export const failed = (type: string, suffix?: string) => `${type}-failed${suffix && `-${suffix}` || ""}`;
export const pending = (type: string, suffix?: string) => `${type}-pending${suffix && `-${suffix}` || ""}`;

export interface IApiActionOptions {
    useMessage?: boolean;
    clearMessage?: boolean;

    beforeSuccess?: (dispatch) => void;
    afterSuccess?: (dispatch) => void;

    beforeError?: (dispatch) => void;
    afterError?: (dispatch) => void;

    /** Custom suffix to apply to sent actions */
    customSuffix?: string;
}

export interface IAsyncActionDependencies {
    getCachedClient: <TClient>(clientType: IClient<TClient>) => TClient;

    createClientWithToken: <TClient>(clientType: IClient<TClient>, token: string) => TClient;

    getSignalRClient: (hubName: string, options?) => ISignalRClient;
}

export interface IThunkAction {
    (dispatch: Function, getState: () => IState, deps: IAsyncActionDependencies): void;
}

export interface IPromiseActionCreator<TInput, TResult> {
    (data: TInput, options?: IApiActionOptions): IThunkAction;

    TYPE: string;
}

export interface IMadePromiseAction<TResult, TInput> {
    payload: IAsyncPayload<TResult, TInput>;

    options?: IApiActionOptions;
}

export const makePromiseAction = <TInput, TResult>(
    type: string,
    action: (
        data: TInput,
        dispatch?,
        getState?: () => IState,
        deps?: IAsyncActionDependencies) => IMadePromiseAction<TResult, TInput>): IPromiseActionCreator<TInput, TResult> => {

    const thunkAction: any = (data: TInput, options?: IApiActionOptions) => {
        return (dispatch: Function, getState: () => IState, deps: IAsyncActionDependencies) => {
            let asyncAction = action(data, dispatch, getState, deps);

            if (asyncAction) {
                dispatch({
                    type: type,
                    ...asyncAction,
                    options: {
                        ...asyncAction.options,
                        ...options
                    }
                } as IPromiseAction<TResult, TInput>);
            }
        };
    };

    thunkAction.TYPE = type;

    return thunkAction;
};

export interface IAsyncActionVoid {
    (): (dispatch?: Dispatch<IState>, getState?: () => IState, deps?: IAsyncActionDependencies) => void;
}

export interface IAsyncAction<TInput> {
    (data: TInput): (dispatch?: Dispatch<IState>, getState?: () => IState, deps?: IAsyncActionDependencies) => void;
}