import {datawolfURL, weatherPatterns} from "../datawolf.config";
import config from "../app.config";

/***
 * Checks if user
 * @returns {Promise.<*>}
 */
export async function checkAuthentication() {

	let personId = sessionStorage.getItem("personId");

	return await fetch(datawolfURL + "/persons/" + personId, {
		method: 'GET',
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Origin": "http://localhost:3000"
		},
		credentials: "include"
	});
}


export function isUserAuthenticated() {

	// Return true if the user is authenticated, else return false.
	checkAuthentication().then(function (checkAuthResponse) {
		return checkAuthResponse.status === 200;
	});
}

export function groupBy(list, keyGetter) {
	const map = new Map();
	list.forEach((item) => {
		const key = keyGetter(item);
		const collection = map.get(key);
		if (!collection) {
			map.set(key, [item]);
		} else {
			collection.push(item);
		}
	});
	return map;
}

export const ID = function () {
	// Math.random should be unique because of its seeding algorithm.
	// Convert it to base 36 (numbers + letters), and grab the first 9 characters
	// after the decimal.
	return '_' + Math.random().toString(36).substr(2, 9);
};

// check if withCoverCropDatasetResultGUID & withoutCoverCropDatasetResultGUID is validate is outside of this
// function
export async function getResult(DatasetResultGUID) {
	let headers = {
		'Content-Type': 'application/json',
		'Access-Control-Origin': 'http://localhost:3000'
	};

		// Get - Result Dataset
		const Response = await
			fetch(datawolfURL + "/datasets/" + DatasetResultGUID, {
				method: 'GET',
				headers: headers,
				credentials: "include"
			});


		const ResultDataset = await
			Response.json();


		let FileDescriptorGUID = -1;

		for (let i = 0; i < ResultDataset.fileDescriptors.length; i++) {
			if (ResultDataset.fileDescriptors[i].filename === "output.json") {
				FileDescriptorGUID = ResultDataset.fileDescriptors[i].id;
				break;
			}
		}

		// Get - Result File Download
		const FileDownloadResponse = await fetch(datawolfURL + "/datasets/"
			+ DatasetResultGUID + "/" + FileDescriptorGUID + "/file",
			{
				method: 'GET',
				headers: headers,
				credentials: "include"
			});

		return await FileDownloadResponse.json();
}

export function getWeatherName(w) {
	if(w){
		return weatherPatterns.find(function (weather){
			return weather.charAt(0) === w;
		});
	}
	return w;
}

export function ConvertDDToDMS(dd)
{
	var deg = dd | 0; // truncate dd to get degrees
	var frac = Math.abs(dd - deg); // get fractional part
	var min = (frac * 60) | 0; // multiply fraction by 60 and truncate
	var sec = frac * 3600 - min * 60;
	sec = sec.toFixed(2);
	return deg + "d " + min + "' " + sec + "\"";
}

export async function getMyFieldList() {
	const CLUapi = config.CLUapi + "/api/userfield?userid=" + sessionStorage.getItem("email");
	let headers = {
		'Content-Type': 'application/json',
		'Access-Control-Origin': 'http://localhost:3000'
	};
	const Response = await fetch(CLUapi, {headers: headers});
	return await Response.json();
}
