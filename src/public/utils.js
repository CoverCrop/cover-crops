import {datawolfURL, weatherPatterns} from "../datawolf.config";
import config from "../app.config";
import ol from "openlayers";
import {CULTIVARS} from "../experimentFile";

const SQUARE_METER_TO_ACRE = 0.000247105;
const QTY_PER_SQUARE_METER_TO_ACRE = 1/SQUARE_METER_TO_ACRE; // ~ 4046.86
const CM_TO_INCH = 0.393701;
const METER_TO_FT = 3.28084167;
const KG_TO_LB = 2.20462;
const HA_TO_ACRE = 2.47105;
const KGPERHA_TO_LBPERACRE = KG_TO_LB/HA_TO_ACRE; // ~ 0.893


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
	return getOutputFile(datasetId, outputFileName, "json");
}

export async function getOutputFileTxt(datasetId, outputFileName = null) {
	return getOutputFile(datasetId, outputFileName, "txt");
}

async function getOutputFile(datasetId, outputFileName = null, filetype) {
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
		if (filetype === "json") {
			return await fileDownloadResponse.json();
		}
		if (filetype === "txt") {
			return await fileDownloadResponse.text();
		}
		return await fileDownloadResponse;
	}
	else {
		return null;
	}
}

export function getWeatherName(w) {
	if (w) {
		return weatherPatterns.find(function (weather) {
			return weather.charAt(0) === w;
		});
	}
	return w;
}

/**
 * @return {string}
 */
export function ConvertDDToDMS(dd) {
	let deg = dd | 0; // truncate dd to get degrees
	let frac = Math.abs(dd - deg); // get fractional part
	let min = (frac * 60) | 0; // multiply fraction by 60 and truncate
	let sec = frac * 3600 - min * 60;
	sec = sec.toFixed(2);
	return deg + "d " + min + "' " + sec + "\"";
}

export function convertDate(dayString) {
	if (dayString) {
		if (dayString.length === 5) {

			return convertFullDate(dayString).substring(5, 10);
		} else {
			return dayString;
		}
	}
}

export function convertFullDate(dayString) {
	if (dayString) {
		if (dayString.length === 5) {
			let year = parseInt(dayString.substring(0, 2)) + 2000;
			let yearcount = parseInt(dayString.substring(dayString.length - 3));
			let date = new Date(year, 0, yearcount);
			return date.toISOString();
		} else {
			return dayString;
		}
	}
}

export function calculateDayOfYear(date) {
	let timeStamp = new Date().setFullYear(date.getFullYear(), 0, 1);
	let yearFirstDay = Math.floor(timeStamp / 86400000);
	let today = Math.ceil((date.getTime()) / 86400000);
	return today - yearFirstDay;
}

export function calculateDayDifference(from, to){
	let diffTime = to.getTime() - from.getTime();

// To calculate the no. of days between two dates
	return (diffTime / (1000 * 3600 * 24));
}

export function convertDateToUSFormat(date){

	return (date.getMonth() + 1) + "/" + date.getDate() + "/" +  date.getFullYear();
}

export function convertDateToUSFormatShort(date){

	return (date.getMonth() + 1) + "/" + date.getDate();
}

//eg. moment to 17096
export function convertDayString(moment) {
	if (moment.dayOfYear() < 99) {
		return (moment.get("year") - 2000).toString() + "0" + moment.dayOfYear().toString();
	}
	return (moment.get("year") - 2000).toString() + moment.dayOfYear().toString();
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

export async function getExperimentSQX(email, CLU_id) {
	let experiment_URL = config.CLUapi + "/api/users/" + email + "/CLUs/" + CLU_id + "/experiment_file_sqx";
	const Response = await fetch(experiment_URL, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Origin": "http://localhost:3000",
			"Cache-Control": "no-cache"
		},
		credentials: "include"
	});

	return Response.text().then(function (expTxt) {
		if (expTxt.includes("EXP.DETAILS")) {
			return expTxt;
		} else {
			return " ";
		}
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
 * Get Extent of the field CLUs in user's profile. return empty extend if no clu available.
 * @param emailId
 */
export function getExtentOfFieldsForUser(emailId) {

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

	getMyFieldList(emailId).then(function (clus) {

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

	}, function (err) {
		console.log(err);
	});

	return currentExtent;

}

export async function wait(ms) {
	new Promise(resolve => setTimeout(resolve, ms));
}

export function findFirstSubstring(textArray, s) {
	for (let i = 0; i < textArray.length; i++) {
		if (textArray[i].indexOf(s) !== -1)
			return i;
	}
	return -1;
}

// add 0 as default to avoid undefined error.
// Cannot read treatment table, its first columns are all 1.
export function readTable(textlines, table_title) {
	let tableobj = {"0": {}};
	let table_line_index = findFirstSubstring(textlines, table_title);
	if (table_line_index >= 0) {
		let table_header = textlines[table_line_index + 1].trim().split(" ").filter(word => word !== "");
		let linenumber = 2;
		let table_body = textlines[table_line_index + linenumber].split(" ").filter(word => word !== "");

		while (table_body.length > 1 && !table_body[0].includes("@")) {
			let colunmobj = {};
			for (let i = 1; i < table_header.length; i++) {
				colunmobj[table_header[i]] = table_body[i];
			}
			tableobj[table_body[0]] = colunmobj;
			linenumber = linenumber + 1;
			table_body = textlines[table_line_index + linenumber].split(" ").filter(word => word !== "");
		}
		return tableobj;
	}
	return {};
}

export function readDuplicateTable(textlines, table_title) {
	let tableobj = {"0": []};
	let table_line_index = findFirstSubstring(textlines, table_title);
	if (table_line_index >= 0) {
		let table_header = textlines[table_line_index + 1].trim().split(" ").filter(word => word !== "");
		let linenumber = 2;
		let table_body = textlines[table_line_index + linenumber].split(" ").filter(word => word !== "");

		while (table_body.length > 1 && !table_body[0].includes("@")) {
			let colunmobj = {};
			for (let i = 1; i < table_header.length; i++) {
				colunmobj[table_header[i]] = table_body[i];
			}
			if (!tableobj[table_body[0]]) tableobj[table_body[0]] = [];
			tableobj[table_body[0]].push(colunmobj);
			linenumber = linenumber + 1;
			table_body = textlines[table_line_index + linenumber].split(" ").filter(word => word !== "");
		}
		return tableobj;
	}
	return {};
}

export function dictToOptions(dict) {
	return Object.keys(dict).map(function (key) {
		return {value: key, label: dict[key]};
	});
}

export function getCropObj(text) {

	let cropobj = {};

	let textlines = text.split("\n");

	if (textlines.length < 10) {
		return cropobj;
	} else {
		let treaments_line_number = findFirstSubstring(textlines, "TREATMENTS");

		let tmptext = textlines[treaments_line_number + 1].replace("TNAME....................", "YEAR CROP");
		let b = tmptext.split(" ");
        // fertilizer is an array, others are single object
		let FERTILIZER = readDuplicateTable(textlines, "FERTILIZERS");
		let PLANTING = readTable(textlines, "PLANTING");
		let HARVEST = readTable(textlines, "HARVEST");
		let TILLAGE = readTable(textlines, "TILLAGE");
		let CULTIVARS = readTable(textlines, "CULTIVARS");
		const exp = {"CU": CULTIVARS, "MF": FERTILIZER, "MP": PLANTING, "MH": HARVEST, "MT": TILLAGE};

		let linenumber = 2;
		let crop = textlines[treaments_line_number + linenumber].split(" ").filter(word => word !== "");

		while (crop.length > 1) {
			let obj = {};
			for (let i = 0; i < b.length; i++) {
				//or check with: if (b.length > i) { assignment }
				obj[b[i]] = exp[b[i]] ? exp[b[i]][crop[i]] : crop[i];
			}

			let objkey = obj["YEAR"] + " " + obj["CROP"];
			cropobj[objkey] = obj;
			linenumber = linenumber + 1;
			crop = textlines[treaments_line_number + linenumber].split(" ").filter(word => word !== "");
		}
		return cropobj;
	}
}

export function getFieldObj(text) {
	let textlines = text.split("\n");
	return readTable(textlines, "FIELDS")[1];
}

export function cropObjToExptxt(text, cropobj) {
	// let tmptext = text.replace("TNAME....................", "YEAR CROP");
	let textlines = text.split("\n");
	const exp = {"MF": "FERTILIZER"};
	const expLocation = {"MF": 12};

	for (let factor in exp) {
		let tableName = exp[factor];
		let table_line_index = findFirstSubstring(textlines, tableName);
		let table_header = textlines[table_line_index + 1].split(" ").filter(word => word !== "");
		for (let cropyear in cropobj) {
			let thisobj = cropobj[cropyear][factor];
			//	get line number
			let exp_line = findFirstSubstring(textlines, cropyear);
			let exp_line_array = textlines[exp_line].split(" ").filter(word => word !== "");
			let lineNumber = parseInt(exp_line_array[expLocation[factor]]);

			if (lineNumber > 0) {
				let modify_line_number = table_line_index + 1 + lineNumber;
				let newline = " " + lineNumber + " " + table_header.map(header => thisobj[header]).join(" ");
				textlines[modify_line_number] = newline;
			}
		}
	}

	return textlines.join("\n");
}

export function isCrop(cropobj){
	return (cropobj["MP"]["PDATE"] && parseInt(cropobj["MP"]["PDATE"])% 1000 < 200) || cropobj["MF"].length >0;
}

export function isCoverCrop(cropobj) {
	return cropobj["CROP"] === "Rye";
}

export function roundResults(val, decimalPlaces){
	if (decimalPlaces === undefined || decimalPlaces === 0) {
		return Math.round(val);
	}
	else {
		return Number(val).toFixed(decimalPlaces);
	}
}

export function convertCmToInches(cm){
	return roundResults(cm * CM_TO_INCH, 2);
}

export function convertMetersToFeet(meters){
	return roundResults(meters * METER_TO_FT, 2);
}

export function convertPerSqMeterToPerAcre(sq_meters){
	return roundResults(sq_meters * QTY_PER_SQUARE_METER_TO_ACRE, 0);
}

export function convertKgPerHaToLbPerAcre(kg_ha){
	return roundResults(kg_ha * KGPERHA_TO_LBPERACRE, 2);
}

