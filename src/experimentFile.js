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
			//remove the year in XDATE
			if(table_header[i].includes("DATE")){
				colunmobj[table_header[i]] = table_body[i].substring(table_body[i].length - 3);
			} else {
				colunmobj[table_header[i]] = table_body[i];
			}
		}
		tableobj[table_body[0]] = colunmobj;
		linenumber = linenumber+1;
		table_body = textlines[table_line_index+linenumber].split(' ').filter( word => word !== "");
	}
	return tableobj;
}


