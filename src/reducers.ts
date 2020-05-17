import { combineReducers } from "@reduxjs/toolkit";
import { loadingBarReducer } from "react-redux-loading-bar";
import alliances from "./lib/domain/game/alliances.slice";
import games from "./lib/domain/game/games.slice";
import ladders from "./lib/domain/game/ladders.slice";
import mapPreview from "./lib/domain/game/mapPreview.slice";
import messages from "./lib/domain/game/messages.slice";
import news from "./lib/domain/game/news.slice";
import play from "./lib/domain/game/play/play.slice";
import tournaments from "./lib/domain/game/tournaments.slice";
import chat from "./lib/domain/shared/chat/chat.slice";
import forms from "./lib/domain/shared/forms/forms.slice";
import general from "./lib/domain/shared/general/general.slice";
import message from "./lib/domain/shared/message/message.slice";
import session from "./lib/domain/shared/session/session.slice";

const rootReducer = combineReducers({
    news,
    chat,
    games,
    mapPreview,
    alliances,
    ladders,
    messages,
    tournaments,
    play,
    loadingBar: loadingBarReducer,
    session,
    forms,
    message,
    general,
});

export type IState = ReturnType<typeof rootReducer>;

export default rootReducer;
