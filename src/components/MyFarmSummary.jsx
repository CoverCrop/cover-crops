import React, {Component} from "react";
import {Cell, Grid, Icon} from "react-mdc-web";
import {findFirstSubstring, convertDate, readTable} from "../public/utils";
import {drainage_type, PLDS, FMCD, FACD} from "../experimentFile";
import config from "../app.config";
import {connect} from "react-redux";

class MyFarmSummary extends Component {

	constructor(props) {
		super(props);
		this.state = {
			soilobj: []
		}
	}

	async getInfo() {
		let that = this;

		fetch(config.CLUapi + "/api/soils?lat=" + that.props.lat + "&lon=" + that.props.lon, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				"Access-Control-Origin": "http://localhost:3000"
			}
		}).then(res => res.json())
			.catch(error => console.error('Error:', error))
			.then(soilobj => {
				this.setState({soilobj});
			});
	}

	componentWillMount() {
		this.getInfo();
	}

	componentWillReceiveProps() {
		this.getInfo();
	}

	render() {

		let {cropobj, fieldobj} = this.props;
		let {soilobj} = this.state;

        // cropComponent will get a warning about div but has no choice.
		let cropComponent = cropobj && Object.values(cropobj)
			.filter(obj => obj["CROP"] !== "Fallow" && obj["CROP"] !== "Rye").map(obj =>
				<tbody>
				<tr key={obj["YEAR"]}>
					<td rowSpan={obj["MF"].length}>{obj["YEAR"]}</td>
					<td rowSpan={obj["MF"].length}>{obj["CROP"]}</td>
					<td rowSpan={obj["MF"].length}>{obj["CU"]["CNAME"]}</td>
					<td rowSpan={obj["MF"].length}>{PLDS[obj["MP"]["PLDS"]]}</td>
					<td rowSpan={obj["MF"].length}>{convertDate(obj["MP"]["PDATE"])}</td>
					<td rowSpan={obj["MF"].length}>{obj["MP"]["PPOP"]}</td>
					<td rowSpan={obj["MF"].length}>{obj["MP"]["PLRS"]}</td>
					<td rowSpan={obj["MF"].length}>{obj["MP"]["PLDP"]}</td>
					<td rowSpan={obj["MF"].length}>{convertDate(obj["MH"]["HDATE"])}</td>
					<td>{obj["MF"].length >0 && FMCD[obj["MF"][0]["FMCD"]]}</td>
					<td>{obj["MF"].length >0 && FACD[obj["MF"][0]["FACD"]]}</td>
					<td>{obj["MF"].length >0 && convertDate(obj["MF"][0]["FDATE"])}</td>
					<td>{obj["MF"].length >0 && obj["MF"][0]["FAMN"]}</td>
					<td>{obj["MF"].length >0 && obj["MF"][0]["FDEP"]}</td>
				</tr>
				{
					obj["MF"].slice(1).map(MFObj =>
						<tr key={obj["YEAR"]+ "-"+ MFObj["FDATE"]}>
							<td>{FMCD[MFObj["FMCD"]]}</td>
							<td>{FACD[MFObj["FACD"]]}</td>
							<td>{convertDate(MFObj["FDATE"])}</td>
							<td>{MFObj["FAMN"]}</td>
							<td>{MFObj["FDEP"]}</td>
						</tr>)
				}
				</tbody>


		);
		// TODO: combine with cropComponent
		let covercropComponent = cropobj && Object.values(cropobj).filter(obj => obj["CROP"] === "Fallow" || obj["CROP"] === "Rye").map(obj =>
			<tr key={obj["YEAR"]}>
				<td>{obj["YEAR"]}</td>
				<td>{obj["CROP"]}</td>
				<td>{obj["CU"]["CNAME"]}</td>
				<td>{PLDS[obj["MP"]["PLDS"]]}</td>
				<td>{convertDate(obj["MP"]["PDATE"])}</td>
				<td>{obj["MP"]["PPOP"]}</td>
				<td>{obj["MP"]["PLDP"]}</td>
				<td>{convertDate(obj["MH"]["HDATE"])}</td>
			</tr>
		);

		let soilComponent = soilobj && soilobj.map( obj =>
			<tr key={obj["depth_bottom"]}>
				<td>{obj["depth_bottom"]}</td>
				<td>{obj["claytotal_r"]}</td>
				<td>{obj["silttotal_r"]}</td>
				<td>{obj["sandtotal_r"]}</td>
				<td>{(obj["om_r"] * 0.58).toFixed(2)}</td>
				<td>{obj["ph1to1h2o_r"]}</td>
				<td>{obj["cec7_r"]}</td>
				<td> -- </td>

			</tr>
		);

		let fieldComponent = fieldobj && (<tr>
			<td>{drainage_type[fieldobj["FLDT"]]}</td>
			<td>{fieldobj["FLDD"]}</td>
			<td>{fieldobj["FLDS"]}</td>
		</tr>);

		return (

			<div>

				<div className="border-top summary-div">
					<p className="myfarm-summary-header">
						<span className="south-field">{this.props.selectedCLUName + "   "}</span>
						<span>
							<a className="download-exp" href={
								config.CLUapi + "/api/users/" + this.props.selectedCLU.userid + "/CLUs/" +
								this.props.selectedCLU.clu + "/experiment_file_sqx?download=true"}>
								<Icon name="file_download"/>
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
							{fieldComponent}
							</tbody>
						</table>
						<hr className="dotted-hr"/>
						<table>

							<thead>
							<tr>
								<th>SOIL</th>
								<th></th>
								<th></th>
								<th></th>
								<th></th>
								<th></th>
								<th></th>
								<th></th>

							</tr>
							</thead>
							<tbody>
							<tr>
								<td>DEPTH, cm</td>
								<td>CLAY, %</td>
								<td>SILT, %</td>
								<td>SAND, %</td>
								<td>ORGANIC CARBON, %</td>
								<td>pH in WATER</td>
								<td>CATION EXCHANGE CAPACITY, cmol/kg</td>
								<td>TOTAL NITROGEN, %</td>
							</tr>
							{soilComponent}
							</tbody>
						</table>

					</div>

					<div className="table-header">
						CROP HISTORY
					</div>
					<div className="summary-table">
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
								<td>ROW SPACING, inch</td>
								<td>Depth, in</td>
								<td>Date</td>
								<td>Material</td>
								<td>Application</td>
								<td>Date</td>
								<td>Amount, lb/acre</td>
								<td>Depth, in</td>
							</tr>

							</thead>
							{cropComponent}
						</table>
					</div>

					<div className="table-header">
						COVER CROP HISTORY
					</div>
					<div className="summary-table">
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

const mapStateToProps = (state) => {
	return {
		cropobj: state.user.cropobj,
		fieldobj: state.user.fieldobj,
	}
};

export default connect(mapStateToProps, null)(MyFarmSummary);
