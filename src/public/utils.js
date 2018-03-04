import {datawolfURL} from "../datawolf.config";

/***
 * Checks if user
 * @returns {Promise.<*>}
 */
export async function checkAuthentication() {

	let personId = localStorage.getItem("personId");

	return await fetch(datawolfURL + "/persons/" + personId, {
		method: 'GET',
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Origin": "http://localhost:3000"
		},
		credentials: "include"
	});
}

