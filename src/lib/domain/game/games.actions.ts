import { createAsyncThunk } from "@reduxjs/toolkit";
import { GameSummary } from "../../../external/imperaClients";
import { GameClient } from "../../../external/GameClient";
import __ from "../../../i18n/i18n";
import { AppThunkArg } from "../../../store";
import { MessageType, showMessage } from "../shared/message/message.slice";
import { getToken } from "../shared/session/session.selectors";
import { refreshNotifications } from "../shared/session/session.slice";

export const fetch = createAsyncThunk<GameSummary[], void, AppThunkArg>(
    "games/fetch",
    async (_, thunkAPI) => {
        const games = await thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), GameClient)
            .getMy();

        await thunkAPI.dispatch(refreshNotifications());

        return games;
    }
);

export const fetchOpen = createAsyncThunk<GameSummary[], void, AppThunkArg>(
    "games/fetch-fun",
    (_, thunkAPI) =>
        thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), GameClient)
            .getAll()
);

export const hide = createAsyncThunk<void, number, AppThunkArg>(
    "games/hide",
    async (gameId, thunkAPI) => {
        await thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), GameClient)
            .patchHide(gameId);

        // Refresh games after hiding
        await thunkAPI.dispatch(fetch());
    }
);

export const hideAll = createAsyncThunk<void, void, AppThunkArg>(
    "games/hide-all",
    async (gameId, thunkAPI) => {
        await thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), GameClient)
            .patchHideAll();

        // Refresh games
        await thunkAPI.dispatch(fetch());
    }
);

export const surrender = createAsyncThunk<GameSummary, number, AppThunkArg>(
    "games/surrender",
    (gameId, thunkAPI) =>
        thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), GameClient)
            .postSurrender(gameId)
);

export const leave = createAsyncThunk<void, number, AppThunkArg>(
    "games/leave",
    async (gameId, thunkAPI) => {
        await thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), GameClient)
            .postLeave(gameId);

        // Refresh games
        await thunkAPI.dispatch(fetch());
    }
);

export const remove = createAsyncThunk<number, number, AppThunkArg>(
    "games/remove",
    async (gameId, thunkAPI) => {
        await thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), GameClient)
            .delete(gameId);

        return gameId;
    }
);

export const join = createAsyncThunk<
    void,
    { gameId: number; password?: string },
    AppThunkArg
>("games/hide", async ({ gameId, password }, thunkAPI) => {
    await thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), GameClient)
        .postJoin(gameId, password || null);

    await thunkAPI.dispatch(fetchOpen());

    thunkAPI.dispatch(
        showMessage({
            message: __(
                "Game joined, you can find it now in [My Games](/game/games)."
            ),
            type: MessageType.success,
        })
    );
});
