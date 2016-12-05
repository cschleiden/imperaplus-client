import { push, replace } from "react-router-redux";
import { IAction, makePromiseAction } from "../../lib/action";

import { getCachedClient, createClientWithToken } from "../../clients/clientFactory";
import { AccountClient, UserInfo } from "../../external/imperaClients";

import { TokenProvider } from "../../services/tokenProvider";

export interface ILoginInput {
    username: string;
    password: string;
}

export interface ILoginPayload {
    access_token: string;
    userInfo: UserInfo;
}

export const LOGIN = "login";
export const login = makePromiseAction<ILoginInput, ILoginPayload>((input, dispatch, getState, deps) =>
    ({
        type: LOGIN,
        payload: {
            promise: deps.getCachedClient(AccountClient)
                .exchange("password", input.username, input.password)
                .then(result => {
                    let authenticatedClient = deps.createClientWithToken(AccountClient, result.access_token);
                    return authenticatedClient.getUserInfo().then(userInfo => ({
                        access_token: result.access_token,
                        userInfo: userInfo
                    }));
                })
        },
        options: {
            useMessage: true,
            afterSuccess: d => d(push("game/start"))
        }
    }));


export const LOGOUT = "logout";
export const logout = makePromiseAction<void, void>((_, dispatch, getState, deps) => ({
    type: LOGOUT,
    payload: {
        promise: deps.getCachedClient(AccountClient).logout()
    },
    options: {
        afterSuccess: d => d(push("/"))
    }
}));

export interface ISignupInput {
    username: string;
    password: string;
    passwordConfirm: string;
    email: string;
}

export const SIGNUP = "signup";
export const signup = makePromiseAction<ISignupInput, void>((input, dispatch, getState, deps) =>
    ({
        type: SIGNUP,
        payload: {
            promise: deps.getCachedClient(AccountClient).register({
                userName: input.username,
                password: input.password,
                confirmPassword: input.passwordConfirm,
                email: input.email,
                language: "en", // TODO: CS
                callbackUrl: "" // TODO
            })
        },
        options: {
            useMessage: true,
            afterSuccess: d => d(replace("signup/confirmation"))
        }
    }));
