import {
    Action,
    configureStore,
    DeepPartial,
    ThunkAction,
} from "@reduxjs/toolkit";
import { NextComponentType, NextPageContext } from "next";
import rootReducer, { IState } from "./reducers";

import { useSelector } from "react-redux";
import { loadingBarMiddleware } from "react-redux-loading-bar";
import { createClient } from "./clients/clientFactory";
import { getSignalRClient } from "./clients/signalrFactory";

const extraArgument = {
    createClient: createClient,
    getSignalRClient: getSignalRClient,
};

let store: AppStore | undefined;
export const getOrCreateStore = (
    getInitialState?: () => DeepPartial<IState>
) => {
    // Always create new store for server-rendered page
    if (typeof window == "undefined") {
        return createStore(getInitialState());
    }

    if (!store) {
        store = createStore(getInitialState());
    }

    return store;
};

export interface InitialState {
    language: string;
}

function createStore(initialState?: DeepPartial<IState>) {
    return configureStore({
        reducer: rootReducer,
        devTools: true,
        //preloadedState: initialState,
        middleware: (getDefaultMiddleware) => {
            const middleware = [
                ...getDefaultMiddleware({
                    thunk: {
                        extraArgument,
                    },
                }),
            ];

            middleware.push(
                loadingBarMiddleware({
                    promiseTypeSuffixes: [
                        "/pending",
                        "/fulfilled",
                        "/rejected",
                    ],
                })
            );

            return middleware;
        },
    });
}

export type RootState = ReturnType<typeof rootReducer>;

export type ThunkExtra = typeof extraArgument;

export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore["dispatch"];

export type AppThunkArg<Rejectvalue = void> = {
    dispatch: AppDispatch;
    state: IState;
    extra: ThunkExtra;
    rejectValue: Rejectvalue;
};

export type AppThunk = ThunkAction<
    Promise<void>,
    IState,
    ThunkExtra,
    Action<string>
>;

export interface AsyncAction<Input = {}> {
    (
        dispatch: AppDispatch,
        getState: () => IState,
        extra: ThunkExtra,
        input: Input
    ): Promise<void>;
}

export type AppPageContext = NextPageContext & { store: AppStore };
export type AppNextPage<P = {}, IP = P> = NextComponentType<
    AppPageContext,
    IP,
    P
> & {
    needsLogin?: boolean;
    getTitle?(state: IState): string;
};

export function useAppSelector<TResult>(
    selector: (s: IState) => TResult
): TResult {
    return useSelector(selector);
}
