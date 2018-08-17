
const defaultState = {
	email: "",
	isAuthenticated: sessionStorage.getItem("personId") !== null,
	userId: "",
	//used in add field page, not used in my farm page.
	clu: 0,
	//cluname is not used current
	cluname: "",
	// could be removed if not necessary.
	exptxt:"",
	cropobj: {},
	fieldobj: {},
	isSelectedEventSuccessful: false
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
		case "SET_SELECTED_USER_EVENT_STATUS":
			return Object.assign({}, state, {
				isSelectedEventSuccessful: action.isSelectedEventSuccessful
			});
		case "CHANGE_EXPERIMENT_TXT":
			return Object.assign({}, state, {
				exptxt: action.exptxt,
				cropobj: action.cropobj,
				fieldobj: action.fieldobj
			});
		default:
			return state;
	}
};

export default user;
