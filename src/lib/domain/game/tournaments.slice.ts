import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    GameSummary,
    Tournament,
    TournamentSummary,
    TournamentTeam,
    TournamentTeamSummary,
} from "../../../external/imperaClients";
import { TournamentClient } from "../../../external/TournamentClient";
import __ from "../../../i18n/i18n";
import { AppThunkArg } from "../../../store";
import { MessageType, showMessage } from "../shared/message/message.slice";
import { getToken } from "../shared/session/session.selectors";

const initialState = {
    isLoading: false,
    tournaments: [] as TournamentSummary[],
    tournament: null as Tournament,
    pairingGames: [] as GameSummary[],
};

export const fetchAll = createAsyncThunk<
    TournamentSummary[],
    void,
    AppThunkArg
>("tournaments/fetch-all", (_, thunkAPI) => {
    return thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), TournamentClient)
        .getAll();
});

export const fetch = createAsyncThunk<Tournament, string, AppThunkArg>(
    "tournaments/fetch",
    (tournamentId, thunkAPI) => {
        return thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), TournamentClient)
            .getById(tournamentId);
    }
);

export const join = createAsyncThunk<void, string, AppThunkArg>(
    "tournaments/join",
    async (tournamentId, thunkAPI) => {
        await thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), TournamentClient)
            .postJoin(tournamentId);

        await thunkAPI.dispatch(fetch(tournamentId));

        thunkAPI.dispatch(
            showMessage({
                message: __("You are now registered for this tournament."),
                type: MessageType.success,
            })
        );
    }
);

export const leave = createAsyncThunk<void, string, AppThunkArg>(
    "tournaments/leave",
    async (tournamentId, thunkAPI) => {
        await thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), TournamentClient)
            .leaveTournament(tournamentId);

        await thunkAPI.dispatch(fetch(tournamentId));

        thunkAPI.dispatch(
            showMessage({
                message: __("You have left this tournament."),
                type: MessageType.success,
            })
        );
    }
);

export const createTeam = createAsyncThunk<
    TournamentTeamSummary,
    {
        tournamentId: string;
        teamName: string;
        teamPassword?: string;
    },
    AppThunkArg
>(
    "tournaments/create-team",
    ({ tournamentId, teamName, teamPassword }, thunkAPI) => {
        return thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), TournamentClient)
            .postCreateTeam(tournamentId, teamName, teamPassword);
    }
);

export const joinTeam = createAsyncThunk<
    TournamentTeam,
    {
        tournamentId: string;
        teamId: string;
        teamPassword?: string;
    },
    AppThunkArg
>(
    "tournaments/join-team",
    ({ tournamentId, teamId, teamPassword }, thunkAPI) => {
        return thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), TournamentClient)
            .postJoinTeam(tournamentId, teamId, teamPassword);
    }
);

export const deleteTeam = createAsyncThunk<
    string,
    {
        tournamentId: string;
        teamId: string;
    },
    AppThunkArg
>("tournaments/delete-team", async ({ tournamentId, teamId }, thunkAPI) => {
    await thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), TournamentClient)
        .deleteTeam(tournamentId, teamId);

    return teamId;
});

export const loadPairingGames = createAsyncThunk<
    GameSummary[],
    string,
    AppThunkArg
>("tournaments/load-pairing-games", (pairingId, thunkAPI) => {
    return thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), TournamentClient)
        .getGamesForPairing(pairingId);
});

export const tournaments = createSlice({
    name: "tournaments",
    initialState,
    reducers: {},
    extraReducers: (b) => {
        b.addCase(fetchAll.pending, (state) => {
            state.isLoading = true;
        });
        b.addCase(fetchAll.fulfilled, (state, action) => {
            state.isLoading = false;
            state.tournaments = action.payload;
        });

        // fetch
        b.addCase(fetch.pending, (state) => {
            state.isLoading = true;
            state.tournament = null;
        });
        b.addCase(fetch.fulfilled, (state, action) => {
            state.isLoading = false;
            state.tournament = action.payload;
        });

        b.addCase(createTeam.fulfilled, (state, action) => {
            state.tournament.teams.push(action.payload);
        });

        b.addCase(joinTeam.fulfilled, (state, action) => {
            const team = action.payload;
            const idx = state.tournament.teams.findIndex(
                (t) => t.id === team.id
            );

            state.tournament.teams.splice(idx, 1, team);
        });

        b.addCase(deleteTeam.fulfilled, (state, action) => {
            const teamId = action.payload;

            const idx = state.tournament.teams.findIndex(
                (t) => t.id === teamId
            );

            if (idx === -1) {
                return state;
            }

            state.tournament.teams.splice(idx, 1);
        });

        b.addCase(loadPairingGames.fulfilled, (state, action) => {
            state.pairingGames = action.payload;
        });
    },
});

export default tournaments.reducer;
