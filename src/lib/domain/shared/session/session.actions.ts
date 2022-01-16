import { remove } from "js-cookie";
import Router from "next/router";
import { createClient } from "../../../../clients/clientFactory";
import { FixedAccountClient } from "../../../../external/accountClient";
import { NotificationClient } from "../../../../external/NotificationClient";
import { notificationService } from "../../../../services/notificationService";
import { AppThunk, AsyncAction } from "../../../../store";
import { isSSR } from "../../../utils/isSSR";
import { getToken } from "./session.selectors";
import { login, restoreSession, scope, storeTokens } from "./session.slice";

function initNotifications(token: string): Promise<void> {
    return notificationService.init(token);
}

export const doLogin: AsyncAction<{
    username: string;
    password: string;
}> = async (dispatch, getState, extra, input) => {
    // Remove any leftover cookies
    remove("bearer_token");

    const result = await extra
        .createClient(getToken(getState()), FixedAccountClient)
        .exchange({
            grant_type: "password",
            username: input.username,
            password: input.password,
            scope,
        });

    const authenticatedAccountClient = extra.createClient(
        result.access_token,
        FixedAccountClient
    );
    const authenticatedNotificationClient = extra.createClient(
        result.access_token,
        NotificationClient
    );

    const results = await Promise.all([
        authenticatedAccountClient.getUserInfo(),
        authenticatedNotificationClient.getSummary(),
    ]);

    dispatch(
        login({
            access_token: result.access_token,
            refresh_token: result.refresh_token,
            userInfo: results[0],
            notifications: results[1],
        })
    );

    storeTokens(result.access_token, result.refresh_token);

    if (!isSSR()) {
        await initNotifications(result.access_token);
    }

    Router.push("/game");
};

export const doRestoreSession =
    (access_token: string, refresh_token: string): AppThunk =>
    async (dispatch) => {
        const client = createClient(access_token, FixedAccountClient);
        const userInfo = await client.getUserInfo();

        dispatch(
            restoreSession({
                access_token,
                refresh_token,
                userInfo,
            })
        );

        // Restore SignalR service if this is run on the client-side
        if (!isSSR()) {
            await initNotifications(access_token);
        }
    };
