export const handleUserLogin = (email, userId, isAuthenticated) => ({
	type: "LOGIN",
	email: email,
	userId: userId,
	isAuthenticated: isAuthenticated
});
