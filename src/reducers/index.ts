import { combineReducers } from "redux";

import { routerReducer } from "react-router-redux";

import { session } from "./session";
import { forms } from "./forms";
import { message } from "./message";

const rootReducer = combineReducers({

    // General reducers
    session,
    routing: routerReducer,
    forms,
    message
});

export default rootReducer;