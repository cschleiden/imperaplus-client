import { IState } from "../../../../reducers";

export function getUserId(state: IState): string {
    return state.session.userInfo.userId;
}

export function getToken(state: IState): string {
    const token = state.session?.access_token;
    console.info("Requested token", token);
    return token;
}

export function isLoggedIn(state: IState): boolean {
    return !!state.session?.access_token && !!state.session?.userInfo;
}
