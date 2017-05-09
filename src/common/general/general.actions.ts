import { IAction } from "../../lib/action";
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
export const setTitle = (title: string): IAction<string> => {
    setDocumentTitle(title);

    return {
        type: SET_TITLE,
        payload: title
    };
};