import {combineReducers} from "redux";
import {connectRouter} from "connected-react-router";
import analysis from "./analysis";
import user from "./user";

const rootReducer = (history) => combineReducers({
	router: connectRouter(history),
	analysis,
	user
});

export default rootReducer;
