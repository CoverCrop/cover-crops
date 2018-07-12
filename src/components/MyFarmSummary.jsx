import React, {Component} from "react";
import Header from './Header'
import Footer from './Footer'
import {Cell, Grid, Icon} from "react-mdc-web";
import LeftPaneCC from "./LeftPaneCC";
import RightPaneCC from "./RightPaneCC";
import AuthorizedWrap from "./AuthorizedWrap"
import AnalyzerWrap from "./AnalyzerWrap";
import MyFarmWrap from "./MyFarmWrap";
import {connect} from "react-redux";
import {findFirstSubstring, getMyFieldList} from "../public/utils";

class MyFarmSummary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cropobj:{},
			fieldobj :{}
		}
	}

	componentWillMount() {
		let that = this;
		//TODO: update experiment datasets & file ID
		fetch("https://covercrop.ncsa.illinois.edu/datawolf/datasets/dd80f5be-76b9-4a57-ae34-7a8da2ccb7ec/943f6da6-6bb6-41f5-b65d-a336d5edfddc/file", {
			method: 'GET', 
			headers:{
				'Content-Type': 'application/json',
				"Access-Control-Origin": "http://localhost:3000"
			},
			credentials: "include"
		}).then(res => res.text())
			.catch(error => console.error('Error:', error))
			.then(text => {
				let cropobj = {};
				
				let textlines = text.split('\n');

				let treaments_line_number = findFirstSubstring(textlines, "TREATMENTS");
				// TODO: move to utils?
                let tmptext = textlines[treaments_line_number+1].replace("TNAME....................", "YEAR CROP");
                let b = tmptext.split(' ');

                let CULTIVARS = { "1": "NEWTON", "2":"DEKALB 591", "3": "M GROUP 2", "4": "FALLOW"};
				let exp =  {"CU": CULTIVARS};
				let linenumber = 2; 
				let crop = textlines[treaments_line_number+linenumber].split(' ').filter( word => word !== "");
				while (crop.length >0){
					let obj = {};
					for (let i = 0; i < b.length; i++) {
						//or check with: if (b.length > i) { assignment }
						
						obj[b[i]] = exp[b[i]]? exp[b[i]][crop[i]]: crop[i];
					}
					let objkey = obj["YEAR"] + " " + obj["CROP"];
	
						cropobj[objkey] = obj;
					
					
					linenumber = linenumber+1;
					crop = textlines[treaments_line_number+linenumber].split(' ').filter( word => word !== "");
				} 



				let plant_line_number = findFirstSubstring(textlines, "PLANTING DETAILS");
				linenumber = 2;
				crop = textlines[plant_line_number+linenumber].split('  ').filter( word => word !== "")
				while(crop.length > 0){
					let objkey = crop[crop.length-1]; 
				
					let pdate = crop[0].substring(crop[0].length - 3);   
                   // TODO: convert to the real date
                    	cropobj[objkey]["PDATE"] = pdate;
        
                    linenumber = linenumber+1;
					crop = textlines[plant_line_number+linenumber].split('  ').filter( word => word !== "");
				}



				let harvest_line_number = findFirstSubstring(textlines, "HARVEST DETAILS");
				linenumber = 2;
				crop = textlines[harvest_line_number+linenumber].split(' ').filter( word => word !== "");
				while(crop.length > 0){
					let objkey = crop[crop.length-2] + " " + crop[crop.length-1];
				
					let hdate = crop[1].substring(crop[1].length - 3);
                   // TODO: convert to the real date
                    	cropobj[objkey]["HDATE"] = hdate;
        
                    linenumber = linenumber+1;
					crop = textlines[harvest_line_number+linenumber].split(' ').filter( word => word !== "");
				}



				let fieldobj = {};
				let drainage_type ={"DR000": "No drainage", "DR001": "Ditches",  "DR002": "Sub-surface tiles", "DR003": "Surface furrows"}
				let drainage_index = text.indexOf('DR00');
				if(drainage_index > 0 ){
					fieldobj["DRAINAGE"] = drainage_type[text.substring(drainage_index, drainage_index+5)]
				}
			

				this.setState({cropobj, fieldobj});

			});

			

	}

	render() {

	    let {cropobj, fieldobj} = this.state;
	    // TODO: filter based on year? remove 2019?

	    let cropComponent = Object.values(cropobj).filter(obj => obj["CROP"] !== "Fallow" && obj["CROP"] !== "Rye").map(obj => 
							<tr key={obj["YEAR"]}>
								<td>{obj["YEAR"]}</td>
								<td>{obj["CROP"]}</td>
								<td>{obj["CU"]}</td>
								<td>{obj["PDATE"]}</td>
								<td>{obj["HDATE"]}</td>
							</tr>
							);
        // TODO: combine with cropComponent
	    let covercropComponent = Object.values(cropobj).filter(obj => obj["CROP"] === "Fallow" || obj["CROP"] === "Rye").map(obj => 
							<tr key={obj["YEAR"]}>
								<td>{obj["YEAR"]}</td>
								<td>{obj["CROP"]}</td>
								<td>{obj["CU"]}</td>
								<td>{obj["PDATE"]}</td>
								<td>{obj["HDATE"]}</td>
							</tr>
							);

		return (

				<div>
					<MyFarmWrap activeTab={4}/>
					<div className="border-top summary-div">
					<p className="myfarm-summary-header">
						<span className="south-field">{this.props.cluname + "   "}</span>
					<span >
						<a className="download-exp" href="https://covercrop.ncsa.illinois.edu/datawolf/datasets/dd80f5be-76b9-4a57-ae34-7a8da2ccb7ec/943f6da6-6bb6-41f5-b65d-a336d5edfddc/file">
						<Icon name="file_download"></Icon>
						</a>
					</span>

					</p>
					<div className="table-header">
						FIELD PROFILE
					</div>
					<div>
						<table>
							<thead>
							<tr>
								<th>DRAINAGE</th>
					
							</tr>
							</thead>
							<tbody>
						<tr>
							<td>{fieldobj["DRAINAGE"]}</td>
						</tr>
							</tbody>
							</table>
					</div>

					<div className="table-header">
						CROP HISTORY
					</div>
						<div>
							<table>
							<thead>
							<tr>
								<th>YEAR</th>
								<th>CROP</th>
								<th>CULTIVAR</th>
								<th>PDATE</th>
								<th>HDATE</th>
							</tr>
							</thead>
							<tbody>
						{cropComponent}
							</tbody>
						
						</table>
					</div>

					<div className="table-header">
						COVER CROP HISTORY
					</div>
					<div>
							<table>
							<thead>
							<tr>
								<th>YEAR</th>
								<th>CROP</th>
								<th>CULTIVAR</th>
								<th>PDATE</th>
								<th>HDATE</th>
							</tr>
							</thead>
							<tbody>
						{covercropComponent}
							</tbody>
						
						</table>
					</div>
					</div>
				</div>

		);
	}
}

export default MyFarmSummary;
