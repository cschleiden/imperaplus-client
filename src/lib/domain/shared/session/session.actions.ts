import { set } from "js-cookie";
import Router from "next/router";
import { FixedAccountClient } from "../../../../external/accountClient";
import { NotificationClient } from "../../../../external/imperaClients";
import { NotificationService } from "../../../../services/notificationService";
import { getTokenProvider } from "../../../../services/tokenProvider";
import { AsyncAction } from "../../../../store";
import { login } from "./session.slice";

export const doLogin: AsyncAction<{
    username: string;
    password: string;
}> = async (dispatch, getState, extra, input) => {
    const scope = "openid offline_access roles";
    const result = await extra
        .getCachedClient(getTokenProvider(getState), FixedAccountClient)
        .exchange({
            grant_type: "password",
            username: input.username,
            password: input.password,
            scope,
        });

    const authenticatedAccountClient = extra.createClientWithToken(
        FixedAccountClient,
        result.access_token
    );
    const authenticatedNotificationClient = extra.createClientWithToken(
        NotificationClient,
        result.access_token
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

    set("token", result.access_token);
    await NotificationService.getInstance().init(getTokenProvider(getState));

    Router.push("/game");
};
