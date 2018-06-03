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
			obj:{},
		}
	}

	componentWillMount() {
		let that = this;
		//TODO: update experiment datasets & file ID
		fetch("https://covercrop.ncsa.illinois.edu/datawolf/datasets/dd80f5be-76b9-4a57-ae34-7a8da2ccb7ec/943f6da6-6bb6-41f5-b65d-a336d5edfddc/file", {
			method: 'GET', // or 'PUT'
			headers:{
				'Content-Type': 'application/json',
				"Access-Control-Origin": "http://localhost:3000"
			},
			credentials: "include"
		}).then(res => res.text())
			.catch(error => console.error('Error:', error))
			.then(text => {
				let textlines = text.split('\n');

				let treaments_line_number = findFirstSubstring(textlines, "TREATMENTS");
				let tmptext = textlines[treaments_line_number+1].replace("TNAME....................", "YEAR CROP");
				let b = tmptext.split(' ');
				let crop = textlines[treaments_line_number+2].split(' ').filter( word => word !== "");
				let CULTIVARS = { "1": "NEWTON", "2":"DEKALB 591", "3": "M GROUP 2", "4": "FALLOW"};
				let exp =  {"CU": CULTIVARS};
				let obj = {};
				for (let i = 0; i < b.length; i++) {
					//or check with: if (b.length > i) { assignment }
					obj[b[i]] = exp[b[i]]? exp[b[i]][crop[i]]: crop[i];
				}
				this.setState({obj});
			});

	}

	render() {

	    let {obj} = this.state;
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
						CROP HISTORY
					</div>
						<div>
							<table>
							<thead>
							<tr>
								<th>YEAR</th>
								<th>CROP</th>
								<th>CULTIVAR</th>
							</tr>
							</thead>
							<tbody>
							<tr>
								<td>{obj["YEAR"]}</td>
								<td>{obj["CROP"]}</td>
								<td>{obj["CU"]}</td>
							</tr>
							</tbody>
						</table>
					</div>

					<div className="table-header">
						COVER CROP HISTORY
					</div>
					<div>aa</div>
					</div>
				</div>

		);
	}
}

export default MyFarmSummary;
