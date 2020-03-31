import { makeImmutable } from "immuts";
import { LOCATION_CHANGE } from "react-router-redux";
import { IAction } from "../../lib/action";
import reducerMap from "../../lib/reducerMap";
import {
    ILookupSetPayload,
    LOOKUP_SET,
    OPEN_CLOSE,
    SET_TITLE,
} from "./general.actions";

const initialState = makeImmutable({
    isNavOpen: false,
    title: "",

    lookup: {} as { [key: string]: any[] },
});

export type IGeneralState = typeof initialState;

const locationChange = (state: IGeneralState) => {
    // Close navigation once we navigate
    return state.__set((x) => x.isNavOpen, false);
};

const openClose = (state: IGeneralState, action: IAction<boolean>) => {
    return state.__set((x) => x.isNavOpen, action.payload);
};

const setLookupData = <T>(
    state: IGeneralState,
    action: IAction<ILookupSetPayload<T>>
) => {
    return state.__set(
        (x) => x.lookup[action.payload.key],
        action.payload.data
    );
};

const setTitle = (state: IGeneralState, action: IAction<string>) => {
    return state.__set((x) => x.title, action.payload);
};

export const general = <TPayload>(
    state = initialState,
    action?: IAction<TPayload>
): IGeneralState => {
    return reducerMap(action, state, {
        [LOCATION_CHANGE]: locationChange,
        [OPEN_CLOSE]: openClose,

        [SET_TITLE]: setTitle,

        [LOOKUP_SET]: setLookupData,
    });
};
