
const defaultState = {
	email: "",
	isAuthenticated: sessionStorage.getItem("personId") !== null,
	userId: "",
	clu: 0,
	//cluname is not used current
	cluname: ""
};

const user = (state = defaultState, action) => {
	switch (action.type) {
		case "CHANGE_USER_CLU":
			return Object.assign({}, state, {
				clu: action.clu,
				cluname: action.cluname
			});
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
