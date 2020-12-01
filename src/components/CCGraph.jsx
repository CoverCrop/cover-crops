import React, {Component} from "react";
import {roundResults, isNumeric} from "../public/utils.js";

import {Line} from "react-chartjs-2";

class CCGraph extends Component {

	render() {


		let graphInfo = [];
		if (this.props.graphInfo){
			graphInfo = this.props.graphInfo;
		}

		let xlabel = this.props.xlabel;
		let ylabel = this.props.ylabel;
		let title = this.props.title;

		if (graphInfo !== null) {

			let dates = [];
			let withcc = [];
			let nocc = [];
			let gdd = [];

			graphInfo.forEach(function(e){
				dates.push(e["date"]);
				if(isNumeric(e["with-cc"])) {
					withcc.push(roundResults(e["with-cc"], 2));
				}
				if(isNumeric(e["no-cc"])) {
					nocc.push(roundResults(e["no-cc"], 2));
				}
				if(isNumeric(e["gdd"])) {
					gdd.push(roundResults(e["gdd"], 1));
				}
			});

			let datasets = [];

			if(withcc.length > 0 ){
				datasets.push({
					label: "w/ Cover Crop",
					data: withcc,
					borderColor: "blue",
					backgroundColor: "blue",
					fill: false,
					pointRadius: 0,
					borderRadius: 2,
					borderWidth: 2
				});
			}

			if(nocc.length > 0){
				datasets.push({
					label: "w/o Cover Crop",
					data: nocc,
					borderColor: "red",
					backgroundColor: "red",
					fill: false,
					pointRadius: 0,
					borderRadius: 2,
					borderWidth: 2
				});
			}

			if(gdd.length > 0){
				datasets.push({
					label: "GDD",
					data: gdd,
					borderColor: "orange",
					backgroundColor: "orange",
					fill: false,
					pointRadius: 0,
					borderRadius: 2,
					borderWidth: 2
				});
			}

			let graphData = {
				labels: dates,
				datasets: datasets
			};

			let graphOptions = {
				title: {
					display: true,
					text: title,
					// fontColor: "DarkBlue",
					fontSize: 16
				},
				layout: {
					padding: {
						// left: 50,
					}
				},
				tooltips: {
					mode: "index",
					intersect: false,
					position: "average",
					callbacks: {
						title: function(tooltipItems, data) {
							return `Date: ${ tooltipItems[0].xLabel}`;
						},
						label: function(item, data) {
							let datasetLabel = data.datasets[item.datasetIndex].label || "";
							let dataPoint = item.yLabel;
							if(ylabel !== "Fahrenheit") {
								return `${datasetLabel}: ${roundResults(dataPoint,
										1)} ${ylabel}`;
							} else {
								return `${datasetLabel}: ${roundResults(dataPoint, 1)} °F)`;
							}
						}
					}
				},
				hover: {
					mode: "index",
					intersect: false
				},
				legend: {
					position: "top",
					labels: {
						usePointStyle: false,
						boxWidth: 15,
						padding: 12
					}
				},
				scales: {
					yAxes: [{
						ticks: {
							// min: 0,
							// max: 100,
							// callback: function(value) {
							// 	return `${value }%`;
							// }
						},
						scaleLabel: {
							display: true,
							labelString: ylabel
						}
					}],
					xAxes: [{
						scaleLabel: {
							display: true,
							labelString: xlabel
						}
					}]
				}
			};

			return (
					<div style={{textAlign: "center", margin: "0 auto"}}>
						<div style={{margin: "0 auto", padding: "15px"}}>
							<Line data={graphData} options={graphOptions}/>
						</div>
						{
							(ylabel === "Fahrenheit")?
									<div style={{fontSize: "14px"}}>
										<b>Growing Degree Days (GDD)</b> are a measure of heat accumulation used to predict plant development rates.
									</div>
									: null
						}

					</div>
			);
		}
		else {
			return (
					<div />
			);
		}
	}
}

export default CCGraph;
