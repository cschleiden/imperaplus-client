import { makeImmutable, IImmutable } from "immuts";
import { reducerMap } from "./lib/shared";

import { IAction, success, pending, failed } from "../actions/action";
import { LOGIN, LOGOUT, SIGNUP, ILoginPayload } from "../actions/session";
import { UserInfo } from "../external/imperaClients";

interface ISessionState {
    userInfo: UserInfo;
    access_token: string;
    isLoggedIn: boolean;
}

type State = IImmutable<ISessionState>;

const initialState = makeImmutable<ISessionState>({
    access_token: null,
    userInfo: null,
    isLoggedIn: false
});

const login = (state: State, action: IAction<ILoginPayload>) => {
    return makeImmutable<ISessionState>({
        access_token: action.payload.access_token,
        isLoggedIn: true,
        userInfo: action.payload.userInfo
    });
};

const logout = (state: State, action: IAction<void>) => {
    return makeImmutable<ISessionState>({
        access_token: null,
        userInfo: null,
        isLoggedIn: false
    });
};

export const session = <TPayload>(
    state: IImmutable<ISessionState> = initialState,
    action?: IAction<TPayload>): IImmutable<ISessionState> => {

    return reducerMap(action, state, {
        [success(LOGIN)]: login,
        [success(LOGOUT)]: logout
    });
};