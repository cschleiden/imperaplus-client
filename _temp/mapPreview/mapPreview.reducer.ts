import { produce } from "immer";
import { IAction, pending, success } from "../../lib/utils/action";
import reducerMap from "../../lib/utils/reducerMap";
import { MapTemplateCacheEntry } from "../play/mapTemplateCache";
import * as Actions from "./mapPreview.actions";

const initialState = makeImmutable({
    isLoading: true,
    mapTemplate: null as MapTemplateCacheEntry,
});

export type IMapPreviewState = typeof initialState;

const done = (
    state: IMapPreviewState,
    action: ActionPayload<MapTemplateCacheEntry>
) => {
    return state.__set(x => x, {
        isLoading: false,
        mapTemplate: action.payload,
    });
};

const loading = (state: IMapPreviewState, action: ActionPayload<void>) => {
    return state.__set(x => x.isLoading, true);
};

export const mapPreview = <TPayload>(
    state = initialState,
    action?: ActionPayload<TPayload>
) => {
    return reducerMap(action, state, {
        [pending(Actions.loadMapPreview.TYPE)]: loading,
        [success(Actions.loadMapPreview.TYPE)]: done,
    });
};
