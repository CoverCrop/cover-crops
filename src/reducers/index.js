import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import analysis from "./analysis";
import login from "./login";

const rootReducer = combineReducers({
	routing: routerReducer,
	analysis,
	login
});

export default rootReducer;
