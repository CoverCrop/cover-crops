import React, {Component} from "react";
import CCGraph from "./CCGraph";
import {convertDateToUSFormat} from "../public/utils";

class CCComponentGraphs extends Component {

	render() {
		let graphInfo = [
			{
				"date": "2019-01-01",
				"with-cc": 79.712177364702,
				"no-cc": 45,
			},
			{
				"date": "2019-02-01",
				"with-cc": 239.712177364702,
				"no-cc": 66,
			},
			{
				"date": "2019-03-01",
				"with-cc": 311,
				"no-cc": 88,
			},
			{
				"date": "2019-04-01",
				"with-cc": 470,
				"no-cc": 230,
			},
			{
				"date": "2019-05-01",
				"with-cc": 530,
				"no-cc": 340,
			},
			{
				"date": "2019-06-01",
				"with-cc": 620,
				"no-cc": 560,
			}
		];

		let ccData = this.props.ccData;
		let noccData = this.props.noCCData;

		let ccNitrogenLossData = ccData["NLTD"].chartData.datasets[0].data;
		let ccNitrogenUptakeData = ccData["NUAD"].chartData.datasets[0].data;

		let nLoss = [];
		let nUptake = [];

		let i = 0;
		ccNitrogenLossData.forEach(function(e) {
			nLoss.push({
				"date": convertDateToUSFormat(e["x"]),
				"with-cc": e["y"],
				"no-cc": noccData["NLTD"].chartData.datasets[0].data[i].y
			});
			i = i + 1;
		});

		ccNitrogenUptakeData.forEach(function(e) {
			nUptake.push({
				"date": convertDateToUSFormat(e["x"]),
				"with-cc": e["y"],
			});
		});

		console.log(nLoss);

		return (
				<div>
					<div>
						<span style={{width: "50%", float: "left"}}>
							<CCGraph xlabel="date" ylabel="lb/acre" title="Nitrogen Loss to Tile Drain" graphInfo={nLoss}/>
						</span>

						<span style={{width: "50%", float: "right"}}>
							<CCGraph xlabel="date" ylabel="lb/acre" title="Nitrogen Uptake" graphInfo={nUptake}/>
						</span>
					</div>

					<div>
						<span style={{width: "50%", float: "left"}}>
							<CCGraph xlabel="date" ylabel="lb/acre" title="Nitrate Leached" graphInfo={graphInfo}/>
						</span>

						<span style={{width: "50%", float: "right"}}>
							<CCGraph xlabel="date" ylabel="lb/acre" title="Total Soil Inorganic Nitrogen" graphInfo={graphInfo}/>
						</span>
					</div>

				</div>
		);
	}
}

export default CCComponentGraphs;
