import { lookupSet } from "../../common/general/general.actions";
import { MessageType, show } from "../../common/message/message.actions";
import { GameClient, GameCreationOptions, MapClient } from "../../external/imperaClients";
import { IAction, makePromiseAction } from "../../lib/action";

export const CREATE = "games-create";
export const create = makePromiseAction<GameCreationOptions, void>((input, dispatch, getState, deps) =>
    ({
        type: CREATE,
        payload: {
            promise: deps.getCachedClient(GameClient).post(input).then<void>((game) => {
                dispatch(show(__("Game created, you can find it now in [My Games](/game/games)."), MessageType.success));
            })
        },
        options: {
            useMessage: true,
            clearMessage: true
        }
    }));

export const getMaps = makePromiseAction<void, void>((input, dispatch, getState, deps) =>
    ({
        type: "MAPS_GET",
        payload: {
            promise: deps.getCachedClient(MapClient).getAllSummary().then(mapTemplates => {
                dispatch(lookupSet("maps", mapTemplates));
            })
        }
    }));