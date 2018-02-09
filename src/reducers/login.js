
const defaultState = {
	email: "",
};


const login = (state = defaultState, action) => {
	switch (action.type) {

		case "LOGIN":
			return Object.assign({}, state, {
				email: action.email
			});

		case "LOGOUT":
			return Object.assign({}, state, {
				email: ""
			});

		default:
			return state;
	}
};

export default login;
