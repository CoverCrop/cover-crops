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

/**
 * @return {string}
 */
export function ConvertDDToDMS(dd)
{
	let deg = dd | 0; // truncate dd to get degrees
	let frac = Math.abs(dd - deg); // get fractional part
	let min = (frac * 60) | 0; // multiply fraction by 60 and truncate
	let sec = frac * 3600 - min * 60;
	sec = sec.toFixed(2);
	return deg + "d " + min + "' " + sec + "\"";
}

export function calculateDayOfYear(date) {
	let timeStamp = new Date().setFullYear(date.getFullYear(), 0, 1);
	let yearFirstDay = Math.floor(timeStamp / 86400000);
	let today = Math.ceil((date.getTime()) / 86400000);
	return today - yearFirstDay;
}

export async function uploadDatasetToDataWolf(yearPlanting, doyPlanting, doyHarvest, isWithCoverCrop) {
	let headers = {
		'Access-Control-Origin': 'http://localhost:3000'
	};

	let userInputFile = new File([
		"{\"with_cover_crop\": " + isWithCoverCrop + "," +
		"\"year_planting\": " + yearPlanting + "," +
		"\"doy_planting\": " + doyPlanting + "," +
		"\"doy_harvest\": " + doyHarvest +
		"}"],
		"user_input.json",
		{type: "text/plain;charset=utf-8", lastModified: Date.now()});

	let data = new FormData();
	data.append("useremail", sessionStorage.getItem("email"));
	data.append("uploadedFile", userInputFile);

	let uploadDatasetResponse = await fetch(
		datawolfURL + "/datasets",
		{
			method: "POST",
			headers: headers,
			body: data,
			credentials: "include",
			contentType: false,
			processData: false
		});

	return uploadDatasetResponse.text().then(function (data) {
		return data;
	});
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
