import {
    GameSummary,
    Tournament,
    TournamentSummary,
    TournamentTeam,
} from "../../external/imperaClients";
import { IAction, pending, success } from "../../lib/utils/action";
import reducerMap from "../../lib/utils/reducerMap";
import * as Actions from "./tournaments.actions";

const initialState = makeImmutable({
    isLoading: false,
    tournaments: [] as TournamentSummary[],
    tournament: null as Tournament,
    pairingGames: [] as GameSummary[],
});

export type ITournamentsState = typeof initialState;

const refresh = (
    state: ITournamentsState,
    action: ActionPayload<TournamentSummary[]>
) => {
    return state.__set(x => x, {
        isLoading: false,
        tournaments: action.payload,
    });
};

const load = (state: ITournamentsState, action: ActionPayload<Tournament>) => {
    return state.__set(x => x, {
        isLoading: false,
        tournament: action.payload,
    });
};

const loadPairingGames = (
    state: ITournamentsState,
    action: ActionPayload<GameSummary[]>
) => {
    return state.__set(x => x.pairingGames, action.payload);
};

const loading = (state: ITournamentsState, action: ActionPayload<void>) => {
    return state.__set(x => x.isLoading, true);
};

const createdTeam = (
    state: ITournamentsState,
    action: ActionPayload<TournamentTeam>
) => {
    return state.__set(
        x => x.tournament.teams,
        x => push(x, action.payload)
    );
};

const joinedTeam = (
    state: ITournamentsState,
    action: ActionPayload<TournamentTeam>
) => {
    const team = action.payload;
    const idx = state.tournament.teams.findIndex(t => t.id === team.id);

    return state.__set(
        x => x.tournament.teams,
        x => push(remove(x, idx), team)
    );
};

const deletedTeam = (
    state: ITournamentsState,
    action: ActionPayload<string>
) => {
    const teamId = action.payload;

    const idx = state.tournament.teams.findIndex(t => t.id === teamId);

    if (idx === -1) {
        return state;
    }

    return state.__set(
        x => x.tournament.teams,
        x => remove(x, idx)
    );
};

export const tournaments = <TPayload>(
    state = initialState,
    action?: ActionPayload<TPayload>
) => {
    return reducerMap(action, state, {
        [pending(Actions.refresh.TYPE)]: loading,
        [success(Actions.refresh.TYPE)]: refresh,

        [pending(Actions.load.TYPE)]: loading,
        [success(Actions.load.TYPE)]: load,

        [success(Actions.loadPairingGames.TYPE)]: loadPairingGames,

        [success(Actions.createTeam.TYPE)]: createdTeam,
        [success(Actions.deleteTeam.TYPE)]: deletedTeam,
        [success(Actions.joinTeam.TYPE)]: joinedTeam,
    });
};
