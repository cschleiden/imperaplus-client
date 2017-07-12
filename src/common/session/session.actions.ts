import { push, replace } from "react-router-redux";
import { baseUri } from "../../configuration";
import { AccountClient, NotificationClient, NotificationSummary, UserInfo } from "../../external/imperaClients";
import { IAction, IAsyncAction, makePromiseAction } from "../../lib/action";
import { EventService } from "../../services/eventService";
import { NotificationService } from "../../services/notificationService";
import { TokenProvider } from "../../services/tokenProvider";
import { MessageType, show } from "../message/message.actions";

const scope = "openid offline_access roles";

export const SET_LANGUAGE = "set-language";
export const setLanguage: IAsyncAction<string> = (language: string) =>
    (dispatch, getState, deps) => {
        localStorage.setItem("impera-lang", language);

        // TODO: Set server side..
        // then() ... once saved:
        dispatch({
            type: SET_LANGUAGE,
            payload: language
        });

        // Reload, so new language bundle can be loaded
        window.location.reload();
    };

export interface ILoginInput {
    username: string;
    password: string;
}

export interface ILoginPayload {
    access_token: string;
    refresh_token: string;
    userInfo: UserInfo;

    notifications: NotificationSummary;
}

export const login = makePromiseAction<ILoginInput, ILoginPayload>(
    "login", (input, dispatch, getState, deps) =>
        ({
            payload: {
                promise: deps.getCachedClient(AccountClient)
                    .exchange("password", input.username, input.password, scope, undefined)
                    .then(result => {
                        let authenticatedAccountClient = deps.createClientWithToken(AccountClient, result.access_token);
                        let authenticatedNotificationClient = deps.createClientWithToken(NotificationClient, result.access_token);

                        return Promise.all([
                            authenticatedAccountClient.getUserInfo(),
                            authenticatedNotificationClient.getSummary()
                        ]).then(results => {
                            return {
                                access_token: result.access_token,
                                refresh_token: result.refresh_token,
                                userInfo: results[0],
                                notifications: results[1]
                            };
                        });
                    })
            },
            options: {
                afterSuccess: d => {
                    NotificationService.getInstance().init().then(() => {
                        d(push("game"));
                    });
                }
            }
        }));


export interface IRefreshPayload {
    access_token: string;
    refresh_token: string;
}

export const REFRESH = "refresh";
export const refresh = (access_token: string, refresh_token: string): IAction<IRefreshPayload> => ({
    type: REFRESH,
    payload: {
        access_token,
        refresh_token
    }
});

export const logout = makePromiseAction<void, null>(
    "logout", (_, dispatch, getState, deps) => ({
        payload: {
            promise: deps.getCachedClient(AccountClient).logout()
        },
        options: {
            afterSuccess: d => {
                // Stop all connections
                EventService.getInstance().fire("signalr.stop");
                d(push("/"));
            }
        }
    }));

export const EXPIRE = "expire";
export const expire = (): IAction<void> => ({
    type: EXPIRE,
    payload: null
});

export interface ISignupInput {
    username: string;
    password: string;
    passwordConfirm: string;
    email: string;
    day: number;
    month: number;
    year: number;
}

export const signup = makePromiseAction<ISignupInput, void>(
    "signup", (input, dispatch, getState, deps) => {
        const birthdate = new Date(input.year, input.month, input.day);
        const ageDiffMs = Date.now() - birthdate.getTime();
        const ageDate = new Date(ageDiffMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);

        if (age < 13) {
            dispatch(replace({
                pathname: "/",
                state: {
                    keepMessage: true
                }
            }));
            dispatch(show(__("You have to be 13 years or older to play Impera."), MessageType.error));

            // Set cookie
            document.cookie = `age_block=${input.username};path=/`;

            return;
        }

        return {
            payload: {
                promise: deps.getCachedClient(AccountClient).register({
                    userName: input.username,
                    password: input.password,
                    confirmPassword: input.passwordConfirm,
                    email: input.email,
                    language: getState().session.data.language || "en",
                    callbackUrl: `${baseUri}activate/userId/code`
                })
            },
            options: {
                useMessage: true,
                afterSuccess: d => d(replace("/signup/confirmation"))
            }
        };
    });

export interface IResetTriggerInput {
    username: string;
    email: string;
}
export const resetTrigger = makePromiseAction<IResetTriggerInput, void>(
    "reset-trigger", (input, dispatch, getState, deps) =>
        ({
            payload: {
                promise: deps.getCachedClient(AccountClient).forgotPassword({
                    userName: input.username,
                    email: input.email,
                    language: getState().session.data.language,
                    callbackUrl: `${baseUri}reset/userId/code`
                }).then<void>(null)
            },
            options: {
                useMessage: true,
                afterSuccess: d => d(replace("/reset/triggered"))
            }
        }));

export interface IResetInput {
    userId: string;
    code: string;
    password: string;
    confirmPassword: string;
}
export const reset = makePromiseAction<IResetInput, void>(
    "reset", (input, dispatch, getState, deps) =>
        ({
            payload: {
                promise: deps.getCachedClient(AccountClient).resetPassword({
                    userId: input.userId,
                    code: input.code,
                    password: input.password,
                    confirmPassword: input.confirmPassword
                }).then<void>(null)
            },
            options: {
                useMessage: true,
                afterSuccess: d => d(replace("/reset/done"))
            }
        }));


export interface IConfirmInput {
    userId: string;
    code: string;
}

export const activate = makePromiseAction<IConfirmInput, {}>(
    "session-activate", (input, dispatch, getState, deps) =>
        ({
            payload: {
                promise: deps.getCachedClient(AccountClient).confirmEmail({
                    userId: input.userId,
                    code: input.code
                })
            },
            options: {
                useMessage: true,
                afterSuccess: d => d(replace("/activated"))
            }
        }));

export interface IChangePasswordInput {
    oldPassword: string;
    password: string;
    passwordConfirmation: string;
}
export const changePassword = makePromiseAction<IChangePasswordInput, {}>(
    "change-password", (input, dispatch, getState, deps) => {
        return {
            payload: {
                promise: deps.getCachedClient(AccountClient).changePassword({
                    oldPassword: input.oldPassword,
                    newPassword: input.password,
                    confirmPassword: input.passwordConfirmation
                })
            },
            options: {
                useMessage: true,
                afterSuccess: d => d(show(__("Password changed."), MessageType.success))
            }
        };
    }
);

export const deleteAccount = makePromiseAction<string, {}>(
    "delete-account", (input, dispatch, getState, deps) => ({
        payload: {
            promise: deps.getCachedClient(AccountClient).deleteAccount({
                password: input
            })
        },
        options: {
            afterSuccess: d => d(logout(null))
        }
    })
);