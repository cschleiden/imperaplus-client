import { IImmutable, makeImmutable } from "immuts";
import reducerMap from "../../lib/reducerMap";

import { UserInfo } from "../../external/imperaClients";
import { failed, IAction, pending, success } from "../../lib/action";
import { EXPIRE, ILoginPayload, IRefreshPayload, LOGIN, LOGOUT, REFRESH, SET_LANGUAGE } from "./session.actions";

const initialState = makeImmutable({
    access_token: null as string,
    refresh_token: null as string,
    userInfo: null as UserInfo,
    isLoggedIn: false,
    language: null as string
});
export type ISessionState = typeof initialState;

const login = (state: ISessionState, action: IAction<ILoginPayload>) => {
    return state.merge(x => x, {
        access_token: action.payload.access_token,
        refresh_token: action.payload.refresh_token,
        isLoggedIn: true,
        userInfo: action.payload.userInfo
    });
};

/** Store updated tokens */
const refresh = (state: ISessionState, action: IAction<IRefreshPayload>) => {
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

export const session = <TPayload>(
    state = initialState,
    action?: IAction<TPayload>): ISessionState => {

    return reducerMap(action, state, {
        [success(LOGIN)]: login,
        [REFRESH]: refresh,
        [EXPIRE]: reset,
        [success(LOGOUT)]: reset,
        [SET_LANGUAGE]: setLanguage
    });
};