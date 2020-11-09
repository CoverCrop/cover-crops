import React, {Component} from "react";
import CCGraph from "./CCGraph";
import {convertDateToUSFormat} from "../public/utils";

class CCComponentGraphs extends Component {

	render() {
		let ccData = this.props.ccData;
		let noccData = this.props.noCCData;
		let popupSrc = this.props.source;
		let gdd = this.props.gdd;

		let ccNitrogenLossData = ccData["NLTD"].chartData.datasets[0].data;
		let ccNitrogenUptakeData = ccData["NUAD"].chartData.datasets[0].data;
		let ccNitrogenLeached = ccData["NLCC"].chartData.datasets[0].data;
		let ccNitrogenSoil = ccData["NIAD"].chartData.datasets[0].data;

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
				"no-cc": noccData["NLTD"].chartData.datasets[0].data[i].y
			});
			i = i + 1;
		});

		i = 0;
		ccNitrogenLeached.forEach(function(e) {
			nLeached.push({
				"date": convertDateToUSFormat(e["x"]),
				"with-cc": e["y"],
				"no-cc": noccData["NLCC"].chartData.datasets[0].data[i].y
			});
			i = i + 1;
		});

		i = 0;
		ccNitrogenSoil.forEach(function(e) {
			nSoil.push({
				"date": convertDateToUSFormat(e["x"]),
				"with-cc": e["y"],
				"no-cc": noccData["NIAD"].chartData.datasets[0].data[i].y
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

		return (

				<div>
						<div style={{display: (popupSrc === "lossReduction")? "block": "none"}}>
							<CCGraph xlabel="date" ylabel="lb/acre" title="Nitrogen Loss to Tile Drain" graphInfo={nLoss}/>
						</div>

						<div style={{display: (popupSrc === "lossReduction")? "block": "none"}}>
							<CCGraph xlabel="date" ylabel="lb/acre" title="Nitrate Leached" graphInfo={nLeached}/>
						</div>

						<div style={{display: (popupSrc === "uptake")? "block": "none"}}>
							<CCGraph xlabel="date" ylabel="lb/acre" title="Nitrogen Uptake" graphInfo={nUptake}/>
						</div>

						<div style={{display: (popupSrc === "uptake")? "block": "none"}}>
							<CCGraph xlabel="date" ylabel="lb/acre" title="Total Soil Inorganic Nitrogen" graphInfo={nSoil}/>
						</div>

						<div style={{display: (popupSrc === "gdd")? "block": "none"}}>
							<CCGraph xlabel="date" ylabel="GDD" title="Growing Degree Days" graphInfo={gddData}/>
						</div>

				</div>

		);
	}
}

export default CCComponentGraphs;
