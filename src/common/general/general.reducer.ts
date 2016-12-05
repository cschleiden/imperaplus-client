import { makeImmutable, IImmutable } from "immuts";
import reducerMap from "../../lib/reducerMap";

import { IAction } from "../../lib/action";
import { OPEN_CLOSE } from "./general.actions";
import { LOCATION_CHANGE } from "react-router-redux";

const initialState = makeImmutable({
    isNavOpen: false
});

export type IGeneralState = typeof initialState;

const locationChange = (state: IGeneralState) => {
    return state.set(x => x.isNavOpen, false);
};

const openClose = (state: IGeneralState, action: IAction<boolean>) => {
    return state.set(x => x.isNavOpen, action.payload);
};

export const general = <TPayload>(
    state = initialState,
    action?: IAction<TPayload>): IGeneralState => {

    return reducerMap(action, state, {
        [LOCATION_CHANGE]: locationChange,
        [OPEN_CLOSE]: openClose
    });
};