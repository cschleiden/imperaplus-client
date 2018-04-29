import { Dispatch } from "react-redux";
import { push } from "react-router-redux";
import { getCachedClient } from "../../clients/clientFactory";
import { FixedAccountClient } from "../../external/accountClient";
import { IState } from "../../reducers";
import { EventService } from "../../services/eventService";
import { close } from "../chat/chat.actions";
import { expire, refresh } from "./session.actions";
import { ISessionState } from "./session.reducer";

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

    private constructor() { }

    public reAuthorize(state: ISessionState, dispatch: Dispatch<IState>): Promise<void> {
        return this.refresh(state.refresh_token).then<void>((result) => {
            // Successful, save new tokens
            dispatch(refresh(result.access_token, result.refresh_token));
        }, () => {
            // Unsuccessful, clear all tokens
            dispatch(expire());

            // Close chat and close all other signalr connections
            dispatch(close());
            EventService.getInstance().fire("signalr.stop");

            // Navigate to login
            dispatch(push("/login"));

            throw new Error(__("Your session expired. Please login again."));
        });
    }

    private refresh(refresh_token: string): Promise<IRefreshResult> {
        const client = getCachedClient(FixedAccountClient);

        return client
            .exchange({
                grant_type: "refresh_token",
                scope,
                refresh_token
            })
            .then(result => {
                return {
                    access_token: result.access_token,
                    refresh_token: result.refresh_token
                };
            });
    }
}