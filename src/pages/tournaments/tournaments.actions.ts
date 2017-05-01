import { IAction, makePromiseAction } from "../../lib/action";
import { TournamentSummary, TournamentClient, Tournament } from "../../external/imperaClients";
import { show, MessageType } from "../../common/message/message.actions";

export const REFRESH = "tournaments-refresh";
export const refresh = makePromiseAction<void, TournamentSummary[]>((input, dispatch, getState, deps) =>
    ({
        type: REFRESH,
        payload: {
            promise: deps.getCachedClient(TournamentClient).getAll()
        },
        options: {
            useMessage: true
        }
    }));

export const LOAD = "tournaments-load";
export const load = makePromiseAction<string, Tournament>((tournamentId, dispatch, getState, deps) =>
    ({
        type: LOAD,
        payload: {
            promise: deps.getCachedClient(TournamentClient).getById(tournamentId)
        },
        options: {
            useMessage: true
        }
    }));


export const JOIN = "tournament-join";
export const join = makePromiseAction<string, null>((tournamentId, dispatch, getState, deps) =>
    ({
        type: JOIN,
        payload: {
            promise: deps.getCachedClient(TournamentClient).postJoin(tournamentId).then(() => {
                // Refresh tournaments after hiding
                dispatch(refresh(null));
                dispatch(show(__("Game joined, you can find it now in [My Games](/game/games)."), MessageType.success));
            })
        },
        options: {
            useMessage: true,
            clearMessage: true
        }
    }));
