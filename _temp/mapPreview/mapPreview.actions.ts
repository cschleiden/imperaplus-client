import { makePromiseAction } from "../../lib/utils/action";
import {
    MapTemplateCacheEntry,
    getMapTemplate,
} from "../play/mapTemplateCache";

export const loadMapPreview = makePromiseAction<string, MapTemplateCacheEntry>(
    "games-map-preview",
    (name, dispatch, getState, deps) => ({
        payload: {
            promise: getMapTemplate(name),
        },
    })
);
