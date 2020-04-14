import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { remove, set } from "js-cookie";
import Router from "next/router";
import { baseUri } from "../../../../configuration";
import { FixedAccountClient } from "../../../../external/accountClient";
import {
    NotificationSummary,
    UserInfo,
} from "../../../../external/imperaClients";
import { NotificationClient } from "../../../../external/NotificationClient";
import __ from "../../../../i18n/i18n";
import { EventService } from "../../../../services/eventService";
import { AppThunkArg } from "../../../../store";
import { MessageType, showMessage } from "../message/message.slice";
import { getToken } from "./session.selectors";

const initialState = {
    access_token: null as string,
    refresh_token: null as string,
    userInfo: null as UserInfo,
    language: "en" as string,
    notifications: {
        numberOfGames: 0,
        numberOfMessages: 0,
    } as NotificationSummary,
};
export type ISessionState = typeof initialState;

export interface IRefreshPayload {
    access_token: string;
    refresh_token: string;
}

export interface ILoginPayload {
    access_token: string;
    refresh_token: string;
    userInfo: UserInfo;

    notifications: NotificationSummary;
}

export const setLanguage = createAsyncThunk<string, string, AppThunkArg>(
    "session/set-language",
    async (language, thunkAPI) => {
        // Persist
        set("lang", language);

        if (thunkAPI.getState().session.access_token) {
            // Store language if user is logged in
            await thunkAPI.extra
                .createClient(getToken(thunkAPI.getState()), FixedAccountClient)
                .setLanguage(language);
        }

        Router.reload();

        return language;
    }
);

export const logout = createAsyncThunk<void, void, AppThunkArg>(
    "session/logout",
    async (_, thunkAPI) => {
        EventService.getInstance().fire("signalr.stop");

        await thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), FixedAccountClient)
            .logout();

        // Clear token
        remove("token");

        Router.push("/");
    }
);

export interface IResetTriggerInput {
    username: string;
    email: string;
}
export const resetTrigger = createAsyncThunk<
    void,
    IResetTriggerInput,
    AppThunkArg
>("session/reset-trigger", async (input, thunkAPI) => {
    await thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), FixedAccountClient)
        .forgotPassword({
            userName: input.username,
            email: input.email,
            language: thunkAPI.getState().session.language,
            callbackUrl: `${baseUri}reset/userId/code`,
        });

    // TODO: useMessage

    Router.push("/reset/triggered");
});

export interface IResetInput {
    userId: string;
    code: string;
    password: string;
    confirmPassword: string;
}
export const reset = createAsyncThunk<void, IResetInput, AppThunkArg>(
    "session/reset-password",
    async (input, thunkAPI) => {
        await thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), FixedAccountClient)
            .resetPassword({
                userId: input.userId,
                code: input.code,
                password: input.password,
                confirmPassword: input.confirmPassword,
            });

        // TODO: useMessage

        Router.push("/reset/done");
    }
);

export interface IConfirmInput {
    userId: string;
    code: string;
}
export const activate = createAsyncThunk<void, IConfirmInput, AppThunkArg>(
    "session/activate",
    async (input, thunkAPI) => {
        await thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), FixedAccountClient)
            .confirmEmail({
                userId: input.userId,
                code: input.code,
            });

        thunkAPI.dispatch(
            showMessage({
                message: __(
                    "Your account has been successfully activated. You can login now."
                ),
                type: MessageType.success,
            })
        );

        Router.push("/activated");
    }
);

export interface IChangePasswordInput {
    oldPassword: string;
    password: string;
    passwordConfirmation: string;
}
export const changePassword = createAsyncThunk<
    void,
    IChangePasswordInput,
    AppThunkArg
>("session/change-password", async (input, thunkAPI) => {
    await thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), FixedAccountClient)
        .changePassword({
            oldPassword: input.oldPassword,
            newPassword: input.password,
            confirmPassword: input.passwordConfirmation,
        }),
        thunkAPI.dispatch(
            showMessage({
                message: __("Password changed."),
                type: MessageType.success,
            })
        );
});

export const deleteAccount = createAsyncThunk<void, string, AppThunkArg>(
    "session/delete-account",
    async (password, thunkAPI) => {
        await thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), FixedAccountClient)
            .deleteAccount({
                password,
            });

        thunkAPI.dispatch(logout());
    }
);

export const refreshNotifications = createAsyncThunk<
    NotificationSummary,
    void,
    AppThunkArg
>("session/refresh-notifications", (_, thunkAPI) =>
    thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), NotificationClient)
        .getSummary()
);

const slice = createSlice({
    name: "session",
    initialState,
    reducers: {
        refresh: (state, action: PayloadAction<IRefreshPayload>) => {
            state.access_token = action.payload.access_token;
            state.refresh_token = action.payload.refresh_token;
        },
        expire: (state) => {
            state = initialState;
        },
        updateUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload;
        },
        login: (state, action: PayloadAction<ILoginPayload>) => {
            state.access_token = action.payload.access_token;
            state.refresh_token = action.payload.refresh_token;
            state.userInfo = action.payload.userInfo;
            state.notifications = action.payload.notifications;
            state.language = action.payload.userInfo.language;
        },
        restoreSession: (
            state,
            action: PayloadAction<{
                access_token: string;
                refresh_token: string;
                userInfo: UserInfo;
            }>
        ) => {
            state.access_token = action.payload.access_token;
            state.refresh_token = action.payload.refresh_token;
            state.userInfo = action.payload.userInfo;
            state.language = action.payload.userInfo.language;
        },
    },
    extraReducers: (b) => {
        b.addCase(logout.fulfilled, (state, action) => {
            state.access_token = null;
            state.refresh_token = null;
            state.userInfo = null;
            state.notifications = null;
        });

        b.addCase(setLanguage.fulfilled, (state, action) => {
            state.language = action.payload;
        });

        b.addCase(refreshNotifications.fulfilled, (state, action) => {
            state.notifications = action.payload;
        });
    },
});

export const { login, refresh, updateUserInfo, restoreSession } = slice.actions;

export default slice.reducer;
