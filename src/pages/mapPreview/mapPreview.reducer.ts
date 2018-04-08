import { IImmutable, makeImmutable } from "immuts";
import { failed, IAction, pending, success } from "../../lib/action";
import reducerMap from "../../lib/reducerMap";
import * as Actions from "./mapPreview.actions";
import { MapTemplateCacheEntry } from "../play/mapTemplateCache";

const initialState = makeImmutable({
    isLoading: true,
    mapTemplate: null as MapTemplateCacheEntry
});

export type IMapPreviewState = typeof initialState;

const done = (state: IMapPreviewState, action: IAction<MapTemplateCacheEntry>) => {
    return state.__set(x => x, {
        isLoading: false,
        mapTemplate: action.payload
    });
};

const loading = (state: IMapPreviewState, action: IAction<void>) => {
    return state.__set(x => x.isLoading, true);
};

export const mapPreview = <TPayload>(
    state = initialState,
    action?: IAction<TPayload>) => {

    return reducerMap(action, state, {
        [pending(Actions.loadMapPreview.TYPE)]: loading,
        [success(Actions.loadMapPreview.TYPE)]: done
    });
};