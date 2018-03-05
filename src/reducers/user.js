
const defaultState = {
	email: "",
	isAuthenticated: false,
	userId: ""
};


const user = (state = defaultState, action) => {
	switch (action.type) {

		case "LOGIN":
			return Object.assign({}, state, {
				email: action.email,
				isAuthenticated: action.isAuthenticated,
				userId: action.userId
			});

		case "LOGOUT":
			return Object.assign({}, state, defaultState);

		default:
			return state;
	}
};

export default user;
