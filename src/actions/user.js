import {getCropObj, getFieldObj} from "../public/utils";

export const handleUserLogin = (email, userId, isAuthenticated) => ({
	type: "LOGIN",
	email,
	userId,
	isAuthenticated
});

export const handleUserLogout = () => ({
	type: "LOGOUT"
});

export const setSelectedUserEventStatus = (isSelectedEventSuccessful) => ({
	type: "SET_SELECTED_USER_EVENT_STATUS",
	isSelectedEventSuccessful
});

export const handleUserCLUChange = (clu, cluname) => ({
	type: "CHANGE_USER_CLU",
	clu,
	cluname
});

export const handleExptxtChange = (exptxt) => ({
	type: "CHANGE_EXPERIMENT_TXT",
	exptxt,
	cropobj: getCropObj(exptxt),
	fieldobj: getFieldObj(exptxt)
});
