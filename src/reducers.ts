import { combineReducers } from "redux";

// General purpose
import { routerReducer,  } from "react-router-redux";
import { forms } from "./common/forms/forms.reducer";
import { message, IMessageState } from "./common/message/message.reducer";
import { session, ISessionState } from "./common/session/session.reducer";

// Game
import { chat, IChatState } from "./common/chat/chat.reducer";
import { news, INewsState } from "./pages/start/news.reducer";

export interface IState {
    news: INewsState;
    chat: IChatState;

    routing: any;
    session: ISessionState;
    forms: any;
    message: IMessageState;
}

const rootReducer = combineReducers<IState>({
    // Game
    news,
    chat,

    // General reducers
    routing: routerReducer,
    session,
    forms,
    message
});

export default rootReducer;