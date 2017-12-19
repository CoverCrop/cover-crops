import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import analysis from './analysis'

const rootReducer = combineReducers({
	routing: routerReducer,
	analysis
});

export default rootReducer;
