import { makeImmutable, IImmutable } from "immuts";
import reducerMap from "../../lib/reducerMap";

import { IAction, success, pending, failed } from "../../lib/action";
import { LOGIN, LOGOUT, REFRESH, EXPIRE, SET_LANGUAGE, ILoginPayload, IRefreshPayload } from "./session.actions";
import { UserInfo } from "../../external/imperaClients";

const buildInitialState = () => makeImmutable({
    access_token: null as string,
    refresh_token: null as string,
    userInfo: null as UserInfo,
    isLoggedIn: false,
    language: null as string
});

const initialState = buildInitialState();
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
const expire = (state: ISessionState, action: IAction<void>) => {
    return initialState;
};

/** Reset state */
const logout = (state: ISessionState, action: IAction<void>) => {
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
        [EXPIRE]: expire,
        [success(LOGOUT)]: logout,
        [SET_LANGUAGE]: setLanguage
    });
};