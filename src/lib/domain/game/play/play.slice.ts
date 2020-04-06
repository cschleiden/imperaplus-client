import {
    ActionReducerMapBuilder,
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";
import Router from "next/router";
import {
    Game,
    GameActionResult,
    GameClient,
    GameSummary,
    HistoryClient,
    HistoryTurn,
    PlaceUnitsOptions,
    PlayClient,
} from "../../../../external/imperaClients";
import { NotificationService } from "../../../../services/notificationService";
import { AppThunkArg } from "../../../../store";
import { UserIdPayload, withUserId } from "../../../../types";
import { getToken, getUserId } from "../../shared/session/session.selectors";
import { canMoveOrAttack, canPlace, inputActive } from "./play.selectors";
import * as Handlers from "./play.slice.handlers";
import { IGameChatMessagesPayload } from "./play.slice.handlers";
import { initialState, PlaySliceState } from "./play.slice.state";

//
//  General actions
//

/**
 * Refresh other games where it's the current player's turn
 */
export const refreshOtherGames = createAsyncThunk<
    GameSummary[],
    void,
    AppThunkArg
>("play/other-games-refresh", (_, thunkAPI) => {
    return thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), GameClient)
        .getMyTurn();
});

export const refreshGame = createAsyncThunk<
    { game: Game } & UserIdPayload,
    void,
    AppThunkArg
>("play/game-refresh", async (_, thunkAPI) => {
    const { gameId } = thunkAPI.getState().play;

    const game = await thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), GameClient)
        .get(gameId);

    return withUserId(thunkAPI.getState(), {
        game,
    });
});

export const gameChatMessages = createAsyncThunk<
    IGameChatMessagesPayload,
    void,
    AppThunkArg
>("play/game-chat-messages", async (_, thunkAPI) => {
    const client = thunkAPI.extra.createClient(
        getToken(thunkAPI.getState()),
        GameClient
    );
    const { gameId } = thunkAPI.getState().play;

    const [team, all] = await Promise.all([
        client.getMessages(gameId, false),
        client.getMessages(gameId, true),
    ]);

    return {
        gameId,
        all,
        team,
    };
});

export interface IGameChatSendMessageInput {
    message: string;
    isPublic: boolean;
}
export const gameChatSendMessage = createAsyncThunk<
    void,
    IGameChatSendMessageInput,
    AppThunkArg
>("play/game-chat-send-message", async (input, thunkAPI) => {
    const { gameId } = thunkAPI.getState().play;
    const { isPublic, message } = input;

    await NotificationService.getInstance().sendGameMessage(
        gameId,
        message,
        isPublic
    );
});

//
// Play actions
//

export const place = createAsyncThunk<
    { result: GameActionResult } & UserIdPayload,
    void,
    AppThunkArg
>("play/place", async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const playState = state.play;
    if (!inputActive(state.play, getUserId(state))) {
        return;
    }

    if (!canPlace(state.play)) {
        return;
    }

    const options = Object.keys(playState.placeCountries)
        .map((ci) => ({
            key: ci,
            units: playState.placeCountries[ci],
        }))
        .filter((x) => x.units > 0)
        .map(
            (x) =>
                ({
                    countryIdentifier: x.key,
                    numberOfUnits: x.units,
                } as PlaceUnitsOptions)
        );

    const result = await thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), PlayClient)
        .postPlace(playState.gameId, options);

    return withUserId(state, { result });
});

export const exchange = createAsyncThunk<
    { result: GameActionResult } & UserIdPayload,
    void,
    AppThunkArg
>("play/exchange", async (_, thunkAPI) => {
    const state = thunkAPI.getState();

    if (!inputActive(state.play, getUserId(state))) {
        return;
    }

    const result = await thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), PlayClient)
        .postExchange(state.play.gameId);

    return withUserId(state, { result });
});

export const attack = createAsyncThunk<
    { result: GameActionResult } & UserIdPayload,
    void,
    AppThunkArg
>("play/attack", async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const playState = state.play;

    if (!inputActive(state.play, getUserId(state))) {
        return;
    }
    if (!canMoveOrAttack(state.play)) {
        return;
    }

    const result = await thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), PlayClient)
        .postAttack(playState.gameId, {
            originCountryIdentifier:
                playState.twoCountry.originCountryIdentifier,
            destinationCountryIdentifier:
                playState.twoCountry.destinationCountryIdentifier,
            numberOfUnits: playState.twoCountry.numberOfUnits,
        });

    return withUserId(state, { result });
});

export const endAttack = createAsyncThunk<
    { result: GameActionResult } & UserIdPayload,
    void,
    AppThunkArg
>("play/endAttack", async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const playState = state.play;

    if (!inputActive(state.play, getUserId(state))) {
        return;
    }

    const result = await thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), PlayClient)
        .postEndAttack(playState.gameId);

    return withUserId(state, { result });
});

export const move = createAsyncThunk<
    { result: GameActionResult } & UserIdPayload,
    void,
    AppThunkArg
>("play/move", async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const playState = state.play;

    if (!inputActive(state.play, getUserId(state))) {
        return;
    }

    if (!canMoveOrAttack(state.play)) {
        return;
    }

    const result = await thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), PlayClient)
        .postMove(playState.gameId, {
            originCountryIdentifier:
                playState.twoCountry.originCountryIdentifier,
            destinationCountryIdentifier:
                playState.twoCountry.destinationCountryIdentifier,
            numberOfUnits: playState.twoCountry.numberOfUnits,
        });

    return withUserId(state, {
        result,
    });
});

export const endTurn = createAsyncThunk<
    { result: GameActionResult } & UserIdPayload,
    void,
    AppThunkArg
>("play/end-turn", async (_, thunkAPI) => {
    const state = thunkAPI.getState();

    if (!inputActive(state.play, getUserId(state))) {
        return;
    }

    const game = await thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), PlayClient)
        .postEndTurn(state.play.gameId);

    thunkAPI.dispatch(refreshOtherGames());

    return withUserId(state, { result: game as any }); // Seems like this used to work?! 🤷‍♂️
});

//
// History actions
//
export const historyTurn = createAsyncThunk<HistoryTurn, number, AppThunkArg>(
    "play/history-turn",
    async (turnId, thunkAPI) => {
        const { gameId } = thunkAPI.getState().play;

        Router.push(`/game/play/${gameId}/history/${turnId}`);

        return thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), HistoryClient)
            .getTurn(gameId, turnId);
    }
);

//
// Slice
//

// Dummy function for type checking
const _ = (...args) =>
    createAsyncThunk<{ result: GameActionResult } & UserIdPayload>(
        args[0],
        args[1]
    );
function addGameResultCase(
    b: ActionReducerMapBuilder<PlaySliceState>,
    action: ReturnType<typeof _>
) {
    b.addCase(action.pending, (state) => Handlers.pendingOperation(state));
    b.addCase(action.fulfilled, Handlers.updateFromResult);
    b.addCase(action.rejected, Handlers.error);
}

const play = createSlice({
    name: "play",
    initialState,
    reducers: {
        // General
        leave: Handlers.leave,
        switchGame: Handlers.switchGame,

        // Play
        selectCountry: Handlers.selectCountry,
        setActionUnits: Handlers.setActionUnits,
        setPlaceUnits: Handlers.setPlaceUnits,

        // History
        historyExit: Handlers.historyExit,

        // Chat
        gameChatMessage: Handlers.gameChatMessage,

        // UI
        toggleSidebar: Handlers.toggleSidebar,
        setUIOption: Handlers.setUIOption,
    },
    extraReducers: (b) => {
        // General
        b.addCase(refreshGame.pending, Handlers.pendingOperation);
        b.addCase(refreshGame.fulfilled, Handlers.refreshGame);

        // Play
        addGameResultCase(b, place);
        addGameResultCase(b, exchange);
        addGameResultCase(b, attack);
        addGameResultCase(b, endAttack);
        addGameResultCase(b, move);
        addGameResultCase(b, endTurn);

        // Chat
        b.addCase(
            gameChatSendMessage.pending,
            Handlers.gameChatSendMessagePending
        );
        b.addCase(
            gameChatSendMessage.fulfilled,
            Handlers.gameChatSendMessageSuccess
        );

        b.addCase(gameChatMessages.fulfilled, Handlers.gameChatMessages);

        // History
        b.addCase(historyTurn.pending, Handlers.pendingOperation);
        b.addCase(historyTurn.fulfilled, Handlers.historyTurn);

        // Other games
        b.addCase(refreshOtherGames.fulfilled, Handlers.refreshOtherGames);
    },
});

export const {
    // General
    leave,
    switchGame,

    // UI
    toggleSidebar,
    setUIOption,

    // Chat
    gameChatMessage,

    // Play
    selectCountry,
    setActionUnits,
    setPlaceUnits,

    // History
    historyExit,
} = play.actions;

export default play.reducer;

// [success(Actions.SWITCH_GAME)]: ActionHandlers.switchGame,
// [pending(Actions.SWITCH_GAME)]: ActionHandlers.pendingOperation,
