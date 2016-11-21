import { push, replace } from "react-router-redux";
import { IAction, makeAsyncAction } from "./action";

import { getCachedClient, createClientWithToken } from "../clients/clientFactory";
import { AccountClient, UserInfo } from "../external/imperaClients";

import { TokenProvider } from "../services/tokenProvider";

export interface ILoginInput {
    username: string;
    password: string;
}

export interface ILoginPayload {
    access_token: string;
    userInfo: UserInfo;
}

export const LOGIN = "login";
export const login = makeAsyncAction<ILoginInput, ILoginPayload>((input, dispatch) =>
    ({
        type: LOGIN,
        payload: {
            promise: getCachedClient(AccountClient)
                .exchange("password", input.username, input.password)
                .then(result => {
                    let authenticatedClient = createClientWithToken(AccountClient, result.access_token);
                    return authenticatedClient.getUserInfo().then(userInfo => ({
                        access_token: result.access_token,
                        userInfo: userInfo
                    }));
                })
        },
        options: {
            useMessage: true,
            afterSuccess: dispatch => dispatch(push("game/start"))
        }
    }));


export const LOGOUT = "logout";
export const logout = makeAsyncAction<void, void>(() => ({
    type: LOGOUT,
    payload: {
        promise: getCachedClient(AccountClient).logout()
    },
    options: {
        afterSuccess: dispatch => dispatch(push("/"))
    }
}));

export interface ISignupInput {
    username: string;
    password: string;
    passwordConfirm: string;
    email: string;
}

export const SIGNUP = "signup";
export const signup = makeAsyncAction<ISignupInput, void>((input, dispatch) =>
    ({
        type: SIGNUP,
        payload: {
            promise: getCachedClient(AccountClient).register({
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
            afterSuccess: dispatch => dispatch(replace("signup/confirmation"))
        }
    }));
