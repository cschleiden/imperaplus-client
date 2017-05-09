import { MessageType, show } from "../../common/message/message.actions";
import { Tournament, TournamentClient, TournamentSummary } from "../../external/imperaClients";
import { IAction, makePromiseAction } from "../../lib/action";

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
                dispatch(load(tournamentId));
                dispatch(show(__("You are now registered for this tournament."), MessageType.success));
            })
        },
        options: {
            useMessage: true,
            clearMessage: true
        }
    }));

export const LEAVE = "tournament-leave";
export const leave = makePromiseAction<string, null>((tournamentId, dispatch, getState, deps) =>
    ({
        type: LEAVE,
        payload: {
            promise: deps.getCachedClient(TournamentClient).leaveTournament(tournamentId).then(() => {
                dispatch(load(tournamentId));
                dispatch(show(__("You have left this tournament."), MessageType.success));
            })
        },
        options: {
            useMessage: true,
            clearMessage: true
        }
    }));
