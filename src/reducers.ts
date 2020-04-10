import { combineReducers } from "@reduxjs/toolkit";
import alliances from "./lib/domain/game/alliances.slice";
import games from "./lib/domain/game/games.slice";
import mapPreview from "./lib/domain/game/mapPreview.slice";
// Domain logic
import news from "./lib/domain/game/news.slice";
import play from "./lib/domain/game/play/play.slice";
import forms from "./lib/domain/shared/forms/forms.slice";
import general from "./lib/domain/shared/general/general.slice";
import message from "./lib/domain/shared/message/message.slice";
// Shared reducers
import session from "./lib/domain/shared/session/session.slice";

const rootReducer = combineReducers({
    // Game
    news,
    // chat,
    games,
    mapPreview,
    alliances,
    // ladders,
    // messages,
    // tournaments,
    play,

    // // General reducers
    // loadingBar: loadingBarReducer,
    session,
    forms,
    message,
    general,
});

export type IState = ReturnType<typeof rootReducer>;

export default rootReducer;
