import { IAction, makePromiseAction } from "../../lib/action";
import { getCachedClient } from "../../clients/clientFactory";
import { GameClient, GameCreationOptions, MapClient } from "../../external/imperaClients";
import { show, MessageBarType } from "../../common/message/message.actions";
import { lookupSet } from "../../common/general/general.actions";

export const CREATE = "games-create";
export const create = makePromiseAction<GameCreationOptions, void>((input, dispatch, getState, deps) =>
    ({
        type: CREATE,
        payload: {
            promise: deps.getCachedClient(GameClient).post(input).then<void>((game) => {
                dispatch(show(__("Game created"), MessageBarType.success));
            })
        },
        options: {
            useMessage: true
        }
    }));

export const getMaps = makePromiseAction<void, void>((input, dispatch, getState, deps) =>
    ({
        type: "MAPS_GET",
        payload: {
            promise: getCachedClient(MapClient).getAllSummary().then(mapTemplates => {
                dispatch(lookupSet("maps", mapTemplates));
            })
        }
    }));