import { IImmutable, makeImmutable } from "immuts";
import reducerMap from "../../lib/reducerMap";

import { LOCATION_CHANGE } from "react-router-redux";
import { IAction } from "../../lib/action";
import { ILookupSetPayload, LOOKUP_SET, OPEN_CLOSE } from "./general.actions";

const initialState = makeImmutable({
    isNavOpen: false,

    lookup: {} as { [key: string]: any[] }
});

export type IGeneralState = typeof initialState;

const locationChange = (state: IGeneralState) => {
    return state.set(x => x.isNavOpen, false);
};

const openClose = (state: IGeneralState, action: IAction<boolean>) => {
    return state.set(x => x.isNavOpen, action.payload);
};

const setLookupData = <T>(state: IGeneralState, action: IAction<ILookupSetPayload<T>>) => {
    return state.set(x => x.lookup[action.payload.key], action.payload.data);
};

export const general = <TPayload>(
    state = initialState,
    action?: IAction<TPayload>): IGeneralState => {

    return reducerMap(action, state, {
        [LOCATION_CHANGE]: locationChange,
        [OPEN_CLOSE]: openClose,

        [LOOKUP_SET]: setLookupData
    });
};