import {datawolfURL, weatherPatterns} from "../datawolf.config";
import config from "../app.config";
import ol from "openlayers";

/***
 * Checks if user
 * @returns {Promise.<*>}
 */
export async function checkAuthentication() {

	let personId = sessionStorage.getItem("personId");

	return await fetch(datawolfURL + "/persons/" + personId, {
		method: "GET",
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

export function sortByDateInDescendingOrder(a, b) {
	return new Date(b.date).getTime() - new Date(a.date).getTime();
}

export const ID = function () {
	// Math.random should be unique because of its seeding algorithm.
	// Convert it to base 36 (numbers + letters), and grab the first 9 characters
	// after the decimal.
	return "_" + Math.random().toString(36).substr(2, 9);
};

// check if withCoverCropDatasetResultGUID & withoutCoverCropDatasetResultGUID is validate is outside of this
// function
export async function getOutputFileJson(datasetId, outputFileName = null) {
	let headers = {
		"Content-Type": "application/json",
		"Access-Control-Origin": "http://localhost:3000"
	};

	// Get - Result Dataset
	const datasetResponse = await
		fetch(datawolfURL + "/datasets/" + datasetId, {
			method: "GET",
			headers: headers,
			credentials: "include"
		});

	const resultDataset = await datasetResponse.json();
	let fileId = -1;

	// If output filename is already provided as input, use that to figure out the exact file that needs to be downloaded
	if (outputFileName !== null) {
		for (let i = 0; i < resultDataset.fileDescriptors.length; i++) {
			if (resultDataset.fileDescriptors[i].filename === outputFileName) {
				fileId = resultDataset.fileDescriptors[i].id;
				break;
			}
		}
	}
	// If no output filename is provided, get the first file in the dataset
	else {

		if (resultDataset.fileDescriptors.length > 0) {
			fileId = resultDataset.fileDescriptors[0].id;
		}
	}

	if (fileId !== -1) {
		// Get - Result File Download
		const fileDownloadResponse = await fetch(datawolfURL + "/datasets/" + datasetId + "/" + fileId + "/file",
			{
				method: "GET",
				headers: headers,
				credentials: "include"
			});

		return await fileDownloadResponse.json();
	}
	else {
		return null;
	}
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

export async function uploadUserInputFile(yearPlanting, doyPlanting, doyHarvest, isWithCoverCrop) {
	let userInputFile = new File([
			"{\"with_cover_crop\": " + isWithCoverCrop + "," +
			"\"year_planting\": " + yearPlanting + "," +
			"\"doy_planting\": " + doyPlanting + "," +
			"\"doy_harvest\": " + doyHarvest +
			"}"],
		"user_input.json",
		{type: "text/plain;charset=utf-8", lastModified: Date.now()});


	return uploadDatasetToDataWolf(userInputFile);
}

export async function uploadDatasetToDataWolf(filedata) {
	let headers = {
		"Access-Control-Origin": "http://localhost:3000"
	};

	let data = new FormData();
	data.append("useremail", sessionStorage.getItem("email"));
	data.append("uploadedFile", filedata);

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

export async function getMyFieldList(email) {
	const CLUapi = config.CLUapi + "/api/userfield?userid=" + email;
	let headers = {
		"Content-Type": "application/json",
		"Access-Control-Origin": "http://localhost:3000"
	};
	const Response = await fetch(CLUapi, {headers: headers});
	return await Response.json();
}

/**
 * Get CLU GeoJSON given a CLU ID
 * @param cluId
 * @returns {Promise.<*>}
 */
export async function getCLUGeoJSON(cluId) {

	const response = await fetch(config.CLUapi + "/api/CLUs/" + cluId, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Origin": "http://localhost:3000"
		}
	});
	return await response.json();
}

/**
 * Get Extent of the field CLUs in user's profile.
 * @param emailId
 */
export function getExtentOfFieldsForUser(emailId){

	let fieldsPolygonLayer = new ol.layer.Vector({
		id: "fieldsPolygon",
		source: new ol.source.Vector({
			features: [
				new ol.Feature({})
			]
		}),
		visible: true
	});
	let fieldPolygonSource = fieldsPolygonLayer.getSource();
	let currentExtent = ol.extent.createEmpty();

	getMyFieldList(emailId).then(function(clus){

		clus.forEach(function (clu) {

			getCLUGeoJSON(clu.clu).then(function (geoJSON) {

				let features = new ol.format.GeoJSON().readFeatures(geoJSON, {
					dataProjection: "EPSG:4326",
					featureProjection: "EPSG:3857"
				});

				fieldPolygonSource.addFeatures(features);
				currentExtent = ol.extent.extend(currentExtent, fieldPolygonSource.getExtent());
				fieldPolygonSource.clear();

			}, function (err) {
				console.log(err);
			});
		});

	}, function(err) {
		console.log(err);
	});

	return currentExtent;

}

export async function wait(ms) {
	new Promise(resolve => setTimeout(resolve, ms));
}
