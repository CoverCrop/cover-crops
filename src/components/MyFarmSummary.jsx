import React, {Component} from "react";
import {Cell, Grid, Icon} from "react-mdc-web";
import {findFirstSubstring, convertDate, readTable} from "../public/utils";
import {drainage_type, CULTIVARS, distribution} from "../experimentFile";

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
		fetch("https://covercrop.ncsa.illinois.edu/datawolf/datasets/9df375c9-cc82-4ec0-a7da-56f8084b83c5/7726d57c-ca77-492a-9401-a5ef9589c7b5/file", {
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

				let FERTILIZER = readTable(textlines, "FERTILIZERS");
				let PLANTING = readTable(textlines, "PLANTING");
				let HARVEST = readTable(textlines, "HARVEST");
				const exp =  {"CU": CULTIVARS, "MF": FERTILIZER, "MP": PLANTING, "MH": HARVEST};


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


				let fieldobj = readTable(textlines, "FIELDS")[1];

				// console.log(fieldobj)

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
				<td>{distribution[obj["MP"]["PLDS"]]}</td>
				<td>{convertDate(obj["MP"]["PDATE"])}</td>
				<td>{obj["MP"]["PPOP"]}</td>
				<td>{obj["MP"]["PLDP"]}</td>
				<td>{convertDate(obj["MH"]["HDATE"])}</td>
				<td>{obj["MF"]["FMCD"]}</td>
				<td>{obj["MF"]["FACD"]}</td>
				<td>{convertDate(obj["MF"]["FDATE"])}</td>
				<td>{obj["MF"]["FAMN"]}</td>
				<td>{obj["MF"]["FDEP"]}</td>
			</tr>
		);
		// TODO: combine with cropComponent
		let covercropComponent = Object.values(cropobj).filter(obj => obj["CROP"] === "Fallow" || obj["CROP"] === "Rye").map(obj =>
			<tr key={obj["YEAR"]}>
				<td>{obj["YEAR"]}</td>
				<td>{obj["CROP"]}</td>
				<td>{obj["CU"]}</td>
				<td>{distribution[obj["MP"]["PLDS"]]}</td>
				<td>{convertDate(obj["MP"]["PDATE"])}</td>
				<td>{obj["MP"]["PPOP"]}</td>
				<td>{obj["MP"]["PLDP"]}</td>
				<td>{convertDate(obj["MH"]["HDATE"])}</td>
			</tr>
		);

		return (

			<div>

				<div className="border-top summary-div">
					<p className="myfarm-summary-header">
						<span className="south-field">{this.props.selectedCLUName + "   "}</span>
						<span >
						<a className="download-exp" href="https://covercrop.ncsa.illinois.edu/datawolf/datasets/dd80f5be-76b9-4a57-ae34-7a8da2ccb7ec/943f6da6-6bb6-41f5-b65d-a336d5edfddc/file">
						<Icon name="file_download"></Icon>
						</a>
					</span>

					</p>
					<div className="table-header">
						FIELD PROFILE
					</div>
					<div className="summary-table">
						<table>

							<thead>
							<tr>
								<th>DRAINAGE</th>
								<th></th>
								<th></th>

							</tr>
							</thead>
							<tbody>
							<tr>
								<td>TYPE</td>
								<td>DEPTH/in</td>
								<td>SPACING/ft</td>
							</tr>
							<tr>
								<td>{drainage_type[fieldobj["FLDT"]]}</td>
								<td>{fieldobj["FLDD"]}</td>
								<td>{fieldobj["FLDS"]}</td>
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
								<th></th>
								<th>Cultivar</th>
								<th></th>
								<th>Planting</th>
								<th></th>
								<th></th>
								<th></th>
								<th>Harvest</th>
								<th>Fertilizer</th>

							</tr>
							<tr>
								<td>YEAR</td>
								<td>CROP</td>
								<td>CULTIVAR</td>
								<td>Distribution</td>
								<td>Date</td>
								<td>POP, seeds/acre</td>
								<td>Depth, in</td>
								<td>Date</td>
								<td>Material</td>
								<td>Application</td>
								<td>Date</td>
								<td>Amount</td>
								<td>Depth, in</td>
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
								<th></th>
								<th>Cultivar</th>
								<th></th>
								<th>Establishment</th>
								<th></th>
								<th></th>
								<th></th>
								<th>Termination</th>

							</tr>
							<tr>
								<td>YEAR</td>
								<td>CROP</td>
								<td>CULTIVAR</td>
								<td>Distribution</td>
								<td>Date</td>
								<td>POP, seeds/acre</td>
								<td>Depth, in</td>
								<td>Date</td>
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
