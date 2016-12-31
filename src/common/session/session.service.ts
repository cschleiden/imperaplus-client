import { AccountClient, UserInfo } from "../../external/imperaClients";
import { getCachedClient, createClientWithToken } from "../../clients/clientFactory";

import { push } from "react-router-redux";
import { refresh, expire } from "./session.actions";
import { store } from "../../store";

const scope = "openid offline_access";

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

    private constructor() { }

    public reAuthorize(): Promise<void> {
        return this.refresh().then<void>((result) => {
            // Successful, save new tokens
            store.dispatch(refresh(result.access_token, result.refresh_token));
        }, () => {
            // Unsuccessful, clear all tokens and redirect to login
            store.dispatch(expire());
            store.dispatch(push("/login"));

            throw new Error(__("Your session expired. Please login again."));
        });
    }

    public refresh(): Promise<IRefreshResult> {
        const refresh_token = store.getState().session.data.refresh_token;

        const client = getCachedClient(AccountClient);

        return client
            .exchange("refresh_token", undefined, undefined, scope, refresh_token)
            .then(result => {
                return {
                    access_token: result.access_token,
                    refresh_token: result.refresh_token
                };
            });
    }
}