import { combineReducers } from "redux";

import { routerReducer } from "react-router-redux";

import { create } from "./createReducer";
import { forms } from "./forms";
import { message } from "./message";

const rootReducer = combineReducers({
    create,

    // General reducers
    routing: routerReducer,
    forms: forms,
    message: message
});

export default rootReducer;