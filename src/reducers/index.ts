import { combineReducers } from "redux";

import { routerReducer } from "react-router-redux";

import { session } from "./session";
import { forms } from "./forms";
import { message } from "./message";
import { news } from "./news";

const rootReducer = combineReducers({
    // Game
    news,

    // General reducers
    routing: routerReducer,
    session,
    forms,
    message
});

export default rootReducer;