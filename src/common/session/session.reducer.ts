import { IImmutable, makeImmutable } from "immuts";
import reducerMap from "../../lib/reducerMap";

import { NotificationSummary, UserInfo } from "../../external/imperaClients";
import { failed, IAction, pending, success } from "../../lib/action";
import * as Actions from "./session.actions";

const initialState = makeImmutable({
    access_token: null as string,
    refresh_token: null as string,
    userInfo: null as UserInfo,
    isLoggedIn: false,
    language: "en" as string,
    notifications: null as NotificationSummary
});
export type ISessionState = typeof initialState;

const login = (state: ISessionState, action: IAction<Actions.ILoginPayload>) => {
    return state.merge(x => x, {
        access_token: action.payload.access_token,
        refresh_token: action.payload.refresh_token,
        isLoggedIn: true,
        userInfo: action.payload.userInfo,
        notifications: action.payload.notifications
    });
};

/** Store updated tokens */
const refresh = (state: ISessionState, action: IAction<Actions.IRefreshPayload>) => {
    return state.merge(x => x, {
        access_token: action.payload.access_token,
        refresh_token: action.payload.refresh_token
    });
};

/** Reset state */
const reset = (state: ISessionState, action: IAction<void>) => {
    return initialState;
};

const setLanguage = (state: ISessionState, action: IAction<string>) => {
    return state.set(x => x.language, action.payload);
};

const refreshNotifications = (state: ISessionState, action: IAction<NotificationSummary>) => {
    return state.set(x => x.notifications, action.payload);
};

export const session = <TPayload>(
    state = initialState,
    action?: IAction<TPayload>): ISessionState => {

    return reducerMap(action, state, {
        [success(Actions.login.TYPE)]: login,
        [Actions.REFRESH]: refresh,
        [Actions.EXPIRE]: reset,
        [success(Actions.logout.TYPE)]: reset,
        [Actions.SET_LANGUAGE]: setLanguage,
        [Actions.refreshNotifications.TYPE]: refreshNotifications
    });
};