import { combineReducers } from "@reduxjs/toolkit";

// Domain logic
import news from "./lib/domain/news.slice";
import games from "./lib/domain/game/games.slice";

// Shared reducers
import session from "./lib/domain/shared/session/session.slice";
import forms from "./lib/domain/shared/forms/forms.slice";
import message from "./lib/domain/shared/message/message.slice";
import general from "./lib/domain/shared/general/general.slice";

const rootReducer = combineReducers({
    // Game
    news,
    // chat,
    games,
    // mapPreview,
    // alliances,
    // ladders,
    // messages,
    // tournaments,
    // play,

    // // General reducers
    // loadingBar: loadingBarReducer,
    session,
    forms,
    message,
    general,
});

export type IState = ReturnType<typeof rootReducer>;

export default rootReducer;
