import { createSlice } from "@reduxjs/toolkit";
import { GameSummary } from "../../../external/imperaClients";
import { fetch, fetchOpen, remove, surrender } from "./games.actions";

const initialState = {
    isLoading: false,
    games: {} as { [gameId: number]: GameSummary },
    openGames: [] as GameSummary[],
};

const games = createSlice({
    name: "games",
    initialState,
    reducers: {},
    extraReducers: (b) => {
        // Fetch games
        b.addCase(fetch.pending, (s, a) => {
            s.isLoading = true;
        });

        b.addCase(fetch.fulfilled, (s, a) => {
            // Convert to map
            const gameMap: { [gameId: number]: GameSummary } = {};

            if (a.payload) {
                for (let game of a.payload) {
                    gameMap[game.id] = game;
                }
            }

            s.isLoading = false;
            s.games = gameMap;
        });

        // Fetch open games
        b.addCase(fetchOpen.pending, (s, a) => {
            s.isLoading = true;
        });

        b.addCase(fetchOpen.fulfilled, (s, a) => {
            s.isLoading = false;
            s.openGames = a.payload;

            s.openGames.sort((a, b) => {
                if (!a.hasPassword && b.hasPassword) {
                    return -1;
                }

                if (a.hasPassword && !b.hasPassword) {
                    return 1;
                }

                return 0;
            });
        });

        // Surrender
        b.addCase(surrender.fulfilled, (s, a) => {
            const game = a.payload;
            s.games[game.id] = game;
        });

        // Remove
        b.addCase(remove.fulfilled, (s, a) => {
            const gameId = a.payload;
            delete s.games[gameId];
        });
    },
});

export default games.reducer;
