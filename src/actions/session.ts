import { push, replace } from "react-router-redux";
import { IAction, makeAsyncAction } from "./action";

import { getClient } from "../clients/clientFactory";
import { AccountClient, LoginResponseModel } from "../external/imperaClients";

export interface ILoginInput {
    username: string;
    password: string;
}

export const LOGIN = "login";
export const login = makeAsyncAction<ILoginInput, LoginResponseModel>(input =>
    ({
        type: LOGIN,
        payload: {
            promise: getClient(AccountClient).exchange("password", input.username, input.password)
        },
        options: {
            useMessage: true
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
            promise: getClient(AccountClient).register({
                userName: input.username,
                password: input.password,
                confirmPassword: input.passwordConfirm,
                email: input.email,
                language: "en", // TODO: CS
                callbackUrl: "" // TODO
            }).then(result => {
                // Success
                dispatch(replace("signup/confirmation"));
            })
        },
        options: {
            useMessage: true
        }
    }));
