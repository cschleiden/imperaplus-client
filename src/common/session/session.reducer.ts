import { makeImmutable, IImmutable } from "immuts";
import reducerMap from "../../lib/reducerMap";

import { IAction, success, pending, failed } from "../../lib/action";
import { LOGIN, LOGOUT, SIGNUP, ILoginPayload } from "./session.actions";
import { UserInfo } from "../../external/imperaClients";

const initialState = makeImmutable({
    access_token: null,
    userInfo: null,
    isLoggedIn: false
});

export type ISessionState = typeof initialState;

const login = (state: ISessionState, action: IAction<ILoginPayload>) => {
    return state.merge(x => x, {
        access_token: action.payload.access_token,
        isLoggedIn: true,
        userInfo: action.payload.userInfo
    });
};

const logout = (state: ISessionState, action: IAction<void>) => {
    return state.merge(x => x, {
        access_token: null,
        userInfo: null,
        isLoggedIn: false
    });
};

export const session = <TPayload>(
    state = initialState,
    action?: IAction<TPayload>): ISessionState => {

    return reducerMap(action, state, {
        [success(LOGIN)]: login,
        [success(LOGOUT)]: logout
    });
};