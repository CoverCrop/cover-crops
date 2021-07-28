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
		let cashCropPlantingDate = this.props.cashCropPlantingDate;

		if (graphInfo !== null) {

			let dates = [];
			let withcc = [];
			let nocc = [];
			let gdd = [];

			graphInfo.forEach(function(e){
				if (isNumeric(e["with-cc"])) {
					withcc.push(roundResults(e["with-cc"], 2));
				}
				if (isNumeric(e["no-cc"])) {
					nocc.push(roundResults(e["no-cc"], 2));
				}
				if (isNumeric(e["gdd"])) {
					let curDate = new Date(`${e["date"] } 00:00:00`);
					// Only show dates till cash crop planting
					if (curDate <= cashCropPlantingDate) {
						gdd.push(roundResults(e["gdd"], 1));
						dates.push(e["date"]);
					}
				}
				else {
					dates.push(e["date"]);
				}
			});

			let datasets = [];

			if (withcc.length > 0 ){
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

			if (nocc.length > 0){
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

			if (gdd.length > 0){
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
				animation: false,
				plugins: {
					title: {
						display: true,
						text: title,
						font: {
							size: 16
						}
					},
					tooltip: {
						mode: "index",
						intersect: false,
						position: "average",
						callbacks: {
							title: function(tooltipItems) {
								if (tooltipItems[0].label !== null) {
									return "Date: " + tooltipItems[0].label;
								} else {
									return "Date: "+ " n/a";
								}
							},
							label: function(context) {
								let label = context.dataset.label || "";

								if (label) {
									label += ": ";
								}
								if (context.parsed.y !== null) {
									if (ylabel !== "Fahrenheit") {
										label += roundResults(context.parsed.y, 1) + " " + ylabel;
									}
									else {
										label += roundResults(context.parsed.y, 1) + " " + "°F";
									}
								}
								return label;
							}
						}
					},
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
					x: {
						title: {
							text: xlabel,
							display: true
						},
						ticks: {
							maxTicksLimit: 16
						}
					},
					y: {
						title: {
							text: ylabel === "Fahrenheit" ? "Cumulative °F" : ylabel,
							display: true,
						},
						suggestedMin: 0
					},

				}
			};

			return (
				<div style={{textAlign: "center", margin: "0 auto"}}>
					<div style={{margin: "0 auto", padding: "15px"}}>
						<Line data={graphData} options={graphOptions} type="line"/>
					</div>
					{
						(ylabel === "Fahrenheit") ?
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
