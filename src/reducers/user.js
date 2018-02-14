
const defaultState = {
	email: "",
};


const user = (state = defaultState, action) => {
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

export default user;
