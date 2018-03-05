
const defaultState = {
	email: "",
	isAuthenticated: sessionStorage.getItem("personId") !== null,
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
			return Object.assign({}, state, {
				email: "",
				isAuthenticated: false,
				userId: ""
			});

		default:
			return state;
	}
};

export default user;
