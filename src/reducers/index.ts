import { combineReducers } from "redux";

import { routerReducer } from "react-router-redux";

import { create } from "./createReducer";
import { forms } from "./forms";

const rootReducer = combineReducers({
    routing: routerReducer,
    create,
    forms: forms
});

export default rootReducer;