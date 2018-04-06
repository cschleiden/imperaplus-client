import { MessageType, show } from "../../common/message/message.actions";
import { Tournament, TournamentClient, TournamentSummary, TournamentTeamSummary } from "../../external/imperaClients";
import { IAction, makePromiseAction } from "../../lib/action";

export const refresh = makePromiseAction<void, TournamentSummary[]>(
    "tournaments-refresh", (input, dispatch, getState, deps) =>
        ({
            payload: {
                promise: deps.getCachedClient(TournamentClient).getAll()
            },
            options: {
                useMessage: true
            }
        }));

export const load = makePromiseAction<string, Tournament>(
    "tournaments-load", (tournamentId, dispatch, getState, deps) =>
        ({
            payload: {
                promise: deps.getCachedClient(TournamentClient).getById(tournamentId)
            },
            options: {
                useMessage: true
            }
        }));

export const join = makePromiseAction<string, void>(
    "tournament-join", (tournamentId, dispatch, getState, deps) =>
        ({
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

export const leave = makePromiseAction<string, void>(
    "tournament-leave", (tournamentId, dispatch, getState, deps) =>
        ({
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

export const createTeam = makePromiseAction<{
    tournamentId: string;
    teamName: string;
    teamPassword?: string;
}, TournamentTeamSummary>(
    "tournament-create-team", (input, dispatch, getState, deps) => {
        return {
            payload: {
                promise: deps.getCachedClient(TournamentClient).postCreateTeam(
                    input.tournamentId,
                    input.teamName,
                    input.teamPassword
                )
            }
        };
    });

export const joinTeam = makePromiseAction(
    "tournament-join-team", (input: {
        tournamentId: string;
        teamId: string;
        teamPassword?: string;
    }, dispatch, getState, deps) => {
        return {
            payload: {
                promise: deps.getCachedClient(TournamentClient).postJoinTeam(
                    input.tournamentId,
                    input.teamId,
                    input.teamPassword
                ).then<void>(null)
            }
        };
    });


export const deleteTeam = makePromiseAction<{
    tournamentId: string;
    teamId: string;
}, string>(
    "tournament-delete-team", (input, dispatch, getState, deps) => {
        return {
            payload: {
                promise: deps.getCachedClient(TournamentClient).deleteTeam(
                    input.tournamentId,
                    input.teamId
                ).then<string>(() => {
                    return input.teamId;
                })
            }
        };
    });
