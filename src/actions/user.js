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
