import { combineReducers } from "redux";

// General purpose
import { loadingBarReducer } from "react-redux-loading-bar";
import { routerReducer } from "react-router-redux";
import { forms } from "./common/forms/forms.reducer";
import { general, IGeneralState } from "./common/general/general.reducer";
import { IMessageState, message } from "./common/message/message.reducer";
import { ISessionState, session } from "./common/session/session.reducer";

// Game
import { chat, IChatState } from "./common/chat/chat.reducer";
import { games, IMyGamesState } from "./pages/games/games.reducer";
import { ILaddersState, ladders } from "./pages/ladders/ladders.reducer";
import { IMessagesState, messages } from "./pages/messages/messages.reducer";
import { IPlayState, play } from "./pages/play/reducer";
import { INewsState, news } from "./pages/start/news.reducer";
import {
    ITournamentsState,
    tournaments,
} from "./pages/tournaments/tournaments.reducer";
import {
    IMapPreviewState,
    mapPreview,
} from "./pages/mapPreview/mapPreview.reducer";
import { IAlliancesState, alliances } from "./pages/alliance/alliances.reducer";

export interface IState {
    news: INewsState;
    chat: IChatState;
    games: IMyGamesState;
    mapPreview: IMapPreviewState;
    alliances: IAlliancesState;
    ladders: ILaddersState;
    tournaments: ITournamentsState;
    messages: IMessagesState;
    play: IPlayState;

    routing: any;
    session: ISessionState;
    forms: any;
    message: IMessageState;
    general: IGeneralState;
}

const rootReducer = combineReducers<IState>({
    // Game
    news,
    chat,
    games,
    mapPreview,
    alliances,
    ladders,
    messages,
    tournaments,
    play,

    // General reducers
    routing: routerReducer,
    loadingBar: loadingBarReducer,
    session,
    forms,
    message,
    general,
});

export default rootReducer;
