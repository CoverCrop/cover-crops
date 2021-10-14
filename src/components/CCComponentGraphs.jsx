import React, {Component} from "react";
import CCGraph from "./CCGraph";
import {convertDateToUSFormat} from "../public/utils";
import {Checkbox, FormControlLabel, Tooltip} from "@material-ui/core";

class CCComponentGraphs extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showAllYears: false
		};
	}

	handleCheckboxChange = (event) => {
		this.setState({showAllYears: event.target.checked});
	}

	render() {
		let ccData = this.props.ccData;
		let noccData = this.props.noCCData;
		let popupSrc = this.props.source;
		let gdd = this.props.gdd;
		let coverPlanting = this.props.coverCropPlantingDate;
		let cashPlanting = this.props.cashCropPlantingDate;

		let ccNitrogenLossData = "NLTD" in ccData ? ccData["NLTD"].chartData.datasets[0].data : ccData["TDNC"].chartData.datasets[0].data;
		let ccNitrogenUptakeData = "NUAD" in ccData ? ccData["NUAD"].chartData.datasets[0].data : ccData["NUAC"].chartData.datasets[0].data;
		let ccNitrogenLeached = ccData["NLCC"].chartData.datasets[0].data;
		let ccNitrogenSoil = ccData["NIAD"].chartData.datasets[0].data;

		let noccNitrogenLossData = "NLTD" in noccData ? noccData["NLTD"].chartData.datasets[0].data : noccData["TDNC"].chartData.datasets[0].data;
		let noccNitrogenLeached = noccData["NLCC"].chartData.datasets[0].data;
		let noccNitrogenSoil = noccData["NIAD"].chartData.datasets[0].data;

		ccNitrogenLossData = ccNitrogenLossData.filter((e) => {
			return (!this.state.showAllYears) ? (e["x"] >= coverPlanting && e["x"] <= cashPlanting) : true;
		});
		noccNitrogenLossData = noccNitrogenLossData.filter((e) => {
			return (!this.state.showAllYears) ? (e["x"] >= coverPlanting && e["x"] <= cashPlanting) : true;
		});

		ccNitrogenUptakeData = ccNitrogenUptakeData.filter((e) => {
			return (!this.state.showAllYears) ? (e["x"] >= coverPlanting && e["x"] <= cashPlanting) : true;
		});

		ccNitrogenLeached = ccNitrogenLeached.filter((e) => {
			return (!this.state.showAllYears) ? (e["x"] >= coverPlanting && e["x"] <= cashPlanting) : true;
		});
		noccNitrogenLeached = noccNitrogenLeached.filter((e) => {
			return (!this.state.showAllYears) ? (e["x"] >= coverPlanting && e["x"] <= cashPlanting) : true;
		});

		ccNitrogenSoil = ccNitrogenSoil.filter((e) => {
			return (!this.state.showAllYears) ? (e["x"] >= coverPlanting && e["x"] <= cashPlanting) : true;
		});
		noccNitrogenSoil = noccNitrogenSoil.filter((e) => {
			return (!this.state.showAllYears) ? (e["x"] >= coverPlanting && e["x"] <= cashPlanting) : true;
		});

		let nLoss = [];
		let nUptake = [];
		let nLeached = [];
		let nSoil = [];
		let gddData = [];

		let i = 0;
		ccNitrogenLossData.forEach(function(e) {
			nLoss.push({
				"date": convertDateToUSFormat(e["x"]),
				"with-cc": e["y"],
				"no-cc": noccNitrogenLossData[i].y
			});
			i = i + 1;
		});

		i = 0;
		ccNitrogenLeached.forEach(function(e) {
			nLeached.push({
				"date": convertDateToUSFormat(e["x"]),
				"with-cc": e["y"],
				"no-cc": noccNitrogenLeached[i].y
			});
			i = i + 1;
		});

		i = 0;
		ccNitrogenSoil.forEach(function(e) {
			nSoil.push({
				"date": convertDateToUSFormat(e["x"]),
				"with-cc": e["y"],
				"no-cc": noccNitrogenSoil[i].y
			});
			i = i + 1;
		});

		ccNitrogenUptakeData.forEach(function(e) {
			nUptake.push({
				"date": convertDateToUSFormat(e["x"]),
				"with-cc": e["y"],
			});
		});

		gdd.forEach(function(e) {
			gddData.push({
				"date": convertDateToUSFormat(e["x"]),
				"gdd": e["y"],
			});
		});


		switch(popupSrc){
			case "lossReduction":
				return (
						<div>
							<div style={{textAlign: "right"}}>
								<Tooltip title={!this.state.showAllYears ? "Select to see all years' data": ""}
												 placement="bottom">
									<FormControlLabel style={{ marginRight: "-16px"}}
											control={<Checkbox checked={this.state.showAllYears} onChange={this.handleCheckboxChange} />}
											label="Show all years" color="Primary"
									/>
								</Tooltip>
							</div>
							<div>
								<CCGraph xlabel="date" ylabel="lb/acre" title="Nitrogen Loss to Tile Drain" graphInfo={nLoss}/>
								<CCGraph xlabel="date" ylabel="lb/acre" title="Nitrate Leached" graphInfo={nLeached}/>
							</div>
						</div>
				);
			case "uptake":
				return (
						<div>
							<div style={{textAlign: "right"}}>
								<Tooltip title={!this.state.showAllYears ? "Select to see all years' data": ""}
												 placement="bottom">
								<FormControlLabel style={{ marginRight: "-16px"}}
										control={<Checkbox checked={this.state.showAllYears} onChange={this.handleCheckboxChange} />}
										label="Show all years" color="Primary"
								/>
								</Tooltip>
							</div>

							<CCGraph xlabel="date" ylabel="lb/acre" title="Nitrogen Uptake" graphInfo={nUptake}/>
							<CCGraph xlabel="date" ylabel="lb/acre" title="Total Soil Inorganic Nitrogen" graphInfo={nSoil}/>
						</div>
				);
			case "gdd":
				return(
						<CCGraph xlabel="date" ylabel="Fahrenheit" title="Growing Degree Days During Cover Crop Growth"
										 graphInfo={gddData} cashCropPlantingDate={this.props.cashCropPlantingDate}/>
				);
			default:
				return(<div/>);
		}

	}
}

export default CCComponentGraphs;
