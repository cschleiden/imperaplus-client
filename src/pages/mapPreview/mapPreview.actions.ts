import { makePromiseAction } from "../../lib/action";
import { MapTemplate } from "../../external/imperaClients";
import { getMapTemplate, MapTemplateCacheEntry } from "../play/mapTemplateCache";

export const loadMapPreview = makePromiseAction<string, MapTemplateCacheEntry>(
    "games-map-preview", (name, dispatch, getState, deps) =>
        ({
            payload: {
                promise: getMapTemplate(name)
            }
        }));
