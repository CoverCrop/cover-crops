import {findFirstSubstring} from "./public/utils";

export const CULTIVARS = { "1": "NEWTON", "2":"DEKALB 591", "3": "M GROUP 2", "4": "FALLOW"};

export const drainage_type ={"DR000": "No drainage",
	"DR001": "Ditches",
	"DR002": "Sub-surface tiles",
	"DR003": "Surface furrows"};

export const distribution = {"R": "Row"}

// add 0 as default to avoid undefined error
export function readTable(textlines, table_title){
	let tableobj = {"0":{}};
	let table_line_index = findFirstSubstring(textlines, table_title);
	let table_header = textlines[table_line_index+1].split(' ').filter( word => word !== "");
	let linenumber = 2;
	let table_body = textlines[table_line_index + linenumber].split(' ').filter( word => word !== "");

	while(table_body.length > 0 && !table_body[0].includes("@")){
		let colunmobj = {};
		for (let i = 1; i < table_header.length; i++) {
			colunmobj[table_header[i]] = table_body[i];
		}
		tableobj[table_body[0]] = colunmobj;
		linenumber = linenumber+1;
		table_body = textlines[table_line_index+linenumber].split(' ').filter( word => word !== "");
	}
	return tableobj;
}

export function convertDate(dayString) {
	if(dayString){
		if(dayString.length === 5){
			let year = parseInt(dayString.substring(0, 2)) + 2000;
			let yearcount = parseInt(dayString.substring(dayString.length - 3));
			let date = new Date(year, 0, yearcount);
			return date.toISOString().substring(5, 10);
		} else {
			return dayString;
		}
	}
}


