import { IAction } from "../../lib/action";

export const OPEN_CLOSE = "nav-open";
export const openCloseNav = (state: boolean): IAction<boolean> => ({
    type: OPEN_CLOSE,
    payload: state
});