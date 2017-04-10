import { combineReducers } from "redux";

// General purpose
import { routerReducer,  } from "react-router-redux";
import { forms } from "./common/forms/forms.reducer";
import { message, IMessageState } from "./common/message/message.reducer";
import { session, ISessionState } from "./common/session/session.reducer";
import { general, IGeneralState } from "./common/general/general.reducer";

// Game
import { chat, IChatState } from "./common/chat/chat.reducer";
import { news, INewsState } from "./pages/start/news.reducer";
import { games, IMyGamesState } from "./pages/games/games.reducer";
import { play, IPlayState } from "./pages/play/reducer";

export interface IState {
    news: INewsState;
    chat: IChatState;
    games: IMyGamesState;
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
    play,

    // General reducers
    routing: routerReducer,
    session,
    forms,
    message,
    general
});

export default rootReducer;