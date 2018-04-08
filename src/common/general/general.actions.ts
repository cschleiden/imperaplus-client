import { IAction, IAsyncAction } from "../../lib/action";
import { setDocumentTitle } from "../../lib/title";

export const OPEN_CLOSE = "nav-open";
export const openCloseNav = (state: boolean): IAction<boolean> => ({
    type: OPEN_CLOSE,
    payload: state
});

export const LOOKUP_SET = "lookup-set";
export interface ILookupSetPayload<T> {
    key: string;
    data: T[];
}
export const lookupSet = <T>(key: string, data: T[]) => ({
    type: LOOKUP_SET,
    payload: {
        key: key,
        data: data
    }
});

export const SET_TITLE = "general-set-title";
export const setTitle: IAsyncAction<string> = (title: string) =>
    (dispatch, getState, deps) => {
        const session = getState().session;
        if (session.isLoggedIn) {
            const gameCount = session && session.notifications && session.notifications.numberOfGames || 0;

            setDocumentTitle(`${title} (${gameCount})`);
        } else {
            setDocumentTitle(title);
        }

        dispatch({
            type: SET_TITLE,
            payload: title
        });
    };