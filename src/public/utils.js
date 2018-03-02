import {datawolfURL} from "../datawolf.config";

/***
 * Checks if user
 * @returns {Promise.<*>}
 */
export async function checkAuthentication() {

	let personId = localStorage.getItem("personId");
	let token = ""; // TODO: Get token here

	return await fetch(datawolfURL + "/persons/" + personId, {
		method: 'GET',
		headers: {
			"Authorization": token,
			"Content-Type": "application/json",
			"Access-Control-Origin": "http://localhost:3000"
		}
	});
}

