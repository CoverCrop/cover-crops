export const handleUserLogin = (email, userId, isAuthenticated) => ({
	type: "LOGIN",
	email,
	userId,
	isAuthenticated
});

export const handleUserLogout = () => ({
	type: "LOGOUT"
});
