import Router from "next/router";
import { getCachedClient } from "../../../../clients/clientFactory";
import { FixedAccountClient } from "../../../../external/accountClient";
import __ from "../../../../i18n/i18n";
import { EventService } from "../../../../services/eventService";
import { AppDispatch } from "../../../../store";
import { logout, refresh } from "./session.slice";
import { ISessionState } from "./session.slice";

const scope = "openid offline_access roles";

export interface IRefreshResult {
    access_token: string;
    refresh_token: string;
}

export class SessionService {
    private static _instance: SessionService;

    public static getInstance() {
        if (!SessionService._instance) {
            SessionService._instance = new SessionService();
        }

        return SessionService._instance;
    }

    private constructor() {}

    public async reAuthorize(
        state: ISessionState,
        dispatch: AppDispatch
    ): Promise<void> {
        try {
            const { access_token, refresh_token } = await this.refresh(
                state.refresh_token
            );

            // Successful, save new tokens
            dispatch(refresh({ access_token, refresh_token }));
        } catch (e) {
            // Unsuccessful, clear all tokens
            dispatch(logout());
            // Close chat and close all other signalr connections
            //dispatch(close()); // TODO: CS
            EventService.getInstance().fire("signalr.stop");

            // Navigate to login
            Router.push("/login");

            throw new Error(__("Your session expired. Please login again."));
        }
    }

    private async refresh(refresh_token: string): Promise<IRefreshResult> {
        const client = getCachedClient(FixedAccountClient);

        const result = await client.exchange({
            grant_type: "refresh_token",
            scope,
            refresh_token,
        });
        return {
            access_token: result.access_token,
            refresh_token: result.refresh_token,
        };
    }
}
