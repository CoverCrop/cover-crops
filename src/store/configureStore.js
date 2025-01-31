import {createStore, compose, applyMiddleware} from "redux";
import reduxImmutableStateInvariant from "redux-immutable-state-invariant";
import thunk from "redux-thunk";
import rootReducer from "../reducers";
import createLogger from "redux-logger";
import {createBrowserHistory} from "history";
import {routerMiddleware} from "react-router-redux";

export const history = createBrowserHistory();

function configureStoreProd(initialState) {
	const middlewares = [
		// Add other middleware on this line...

		// thunk middleware can also accept an extra argument to be passed to each thunk action
		// https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
		thunk,
	];

	return createStore(rootReducer(history), initialState, compose(
		applyMiddleware(routerMiddleware(history), ...middlewares)
	)
	);
}

function configureStoreDev(initialState) {
	const middlewares = [
		// Add other middleware on this line...

		// Redux middleware that spits an error on you when you try to mutate your state either inside a dispatch or between dispatches.
		reduxImmutableStateInvariant(),

		// thunk middleware can also accept an extra argument to be passed to each thunk action
		// https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
		thunk,
	];

	// adds support for Redux dev tools
	const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	const store = createStore(rootReducer(history), initialState, composeEnhancers(
		applyMiddleware(routerMiddleware(history),...middlewares, createLogger())
	)
	);

	if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept("../reducers", () => {
			const nextReducer = require("../reducers").default; // eslint-disable-line global-require
			store.replaceReducer(nextReducer);
		});
	}

	return store;
}

const configureStore = process.env.NODE_ENV === "production" ? configureStoreProd : configureStoreDev;

export default configureStore;
