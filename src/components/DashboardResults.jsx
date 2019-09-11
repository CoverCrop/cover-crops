import React, {Component} from "react";
import { connect } from "react-redux";

// import Plot from "react-plotly.js";
//TODO: Performance took a hit. Bundle size increased from 6 MB to 13 MB

// customizable method: use your own `Plotly` object - Improve performance
//plotly-basic.min is supposed to have most features we need, we can use it
// instead and decrease size by 3 MB
import Plotly from "plotly.js/dist/plotly.min";
import createPlotlyComponent from "react-plotly.js/factory";
import {Grid, Cell} from "react-mdc-web";

import {
	Table,
	TableBody,
	TableCell,
	TableRow,
	TableHead,

} from "@material-ui/core";

const Plot = createPlotlyComponent(Plotly);

class DashboardResults extends Component {

	constructor(props) {
		super(props);
		this.generateChartsHTML = this.generateChartsHTML.bind(this);
		this.generateTableHTML = this.generateTableHTML.bind(this);
	}

	// Generates charts array object containing individual charts and datasets
	getDashboardDataArray(chartArrayTypeName, plantingDate, harvestDate) {
		let chartDataArray = {};
		let colorIndex = 0;
		let minTime = plantingDate.getTime();
		let maxTime = harvestDate.getTime();
		let chartOptions = {};

		if (this.props.hasOwnProperty(chartArrayTypeName) && this.props[chartArrayTypeName] !== null) {
			if(this.props[chartArrayTypeName].hasOwnProperty("charts")){
				// Iterate over each chart
				let charts =  this.props[chartArrayTypeName].charts;
				for (let dataIndex = 0; dataIndex < charts.length; dataIndex++) {
					let chartRawData = charts[dataIndex];

					let rawDatasets = chartRawData.datasets;
					let parsedDatasets = [];

					// Iterate over each dataset in the chart
					for (let datasetIndex = 0; datasetIndex < rawDatasets.length; datasetIndex++) {

						let rawData = rawDatasets[datasetIndex].data;
						let parsedData = [];

						// Generate data to be added to the dataset
						for (let dataIndex = 0; dataIndex < rawData.length; dataIndex++) {
							// TODO: Remove the if condition. Temporary fix till server-side bug is fixed.
							if (!(chartRawData.title === "Carbon : Nitrogen" && dataIndex === 0)) {
								parsedData.push({
									x: new Date(rawData[dataIndex].YEAR, 0, rawData[dataIndex].DOY),
									y: rawData[dataIndex].value
								});
							}
						}

						// Create dataset object with appropriate options and data
						let datasetLabel = (chartArrayTypeName === "withCoverCropChartDataArray") ? "w/ Cover Crop" : "w/o Cover Crop";
						let dataset = {
							label: datasetLabel,

							data: parsedData
						};

						parsedDatasets.push(dataset);
					}

					let chartData = {
						// TODO: Check with team on this. Having fixed labels vs dynamic labels selected by chart.js based on input data
						// labels: labelArray,
						datasets: parsedDatasets
					};

					// Chart for this variable has been already created
					if (chartDataArray.hasOwnProperty(chartRawData.variable)) {
						chartDataArray[chartRawData.variable].chartData.datasets = chartDataArray[chartRawData.variable].chartData.datasets.concat(parsedDatasets);
					}
					// Chart for this variable has to be created
					else {
						chartDataArray[chartRawData.variable] = {
							chartData: chartData,
							chartOptions: chartOptions
						};
					}
				}
			}
		}
		return chartDataArray;
	}

	// Generate and return charts HTML content
	generateChartsHTML() {

		let plantingDate = new Date();
		let harvestDate = new Date();
		let harvestDateMin = new Date();
		let harvestDateMax = new Date();
		let ymax = 2300; //TODO: Get this dynamically
		let chartDataArray = {}; // Associative array to store chart data
		let biomassDates = [];
		let biomassValues = [];
		let cnDates = [];
		let cnValues = [];

		let cnRows = [];
		let biomassRows = [];

		if (this.props.hasOwnProperty("userInputJson") && this.props["userInputJson"] !== null && this.props["userInputJson"] !== undefined) {

			let plantingYear = this.props["userInputJson"]["year_planting"];
			let harvestYear = plantingYear + 1;
			let plantingDOY = this.props["userInputJson"]["doy_planting"];
			let harvestDOY = this.props["userInputJson"]["doy_harvest"];
			plantingDate = new Date(plantingYear, 0, plantingDOY);
			harvestDate = new Date(harvestYear, 0, harvestDOY);
			harvestDateMin = new Date(harvestYear, 0, harvestDOY - 7);
			harvestDateMax = new Date(harvestYear, 0, harvestDOY + 7);

			console.log(plantingDate);
			console.log(harvestDateMin);
			console.log(harvestDateMax);

		}

		chartDataArray = this.getDashboardDataArray("withCoverCropChartDataArray", plantingDate, harvestDate); // generate charts for with cover crop case
		console.log("dashboard array: ");
		console.log(chartDataArray);
		for (let key in chartDataArray) {
			if(key.toString() === "C:N ratio"){
				cnRows = chartDataArray[key].chartData.datasets[0].data;
			}

			if(key.toString() === "TWAD"){
				biomassRows = chartDataArray[key].chartData.datasets[0].data;
			}
		}

		console.log(cnRows);
		console.log(biomassRows);

		cnRows.forEach(function(element) {
			cnDates.push(element.x);
			cnValues.push(element.y);
		});

		biomassRows.forEach(function(element) {
			biomassDates.push(element.x);
			biomassValues.push(element.y);
		});

		//console.log(cnDates);


		let resultHtml = [];
		let selectorOptions = {
			x: 0.01,
			y: 1.08,
			buttons: [{
				step: "month",
				stepmode: "backward",
				count: 1,
				label: "1m"
			}, {
				step: "month",
				stepmode: "backward",
				count: 6,
				label: "6m",
				active: true
			}, {
				step: "year",
				stepmode: "todate",
				count: 1,
				label: "YTD"
			}, {
				step: "year",
				stepmode: "backward",
				count: 1,
				label: "1y"
			}, {
				step: "all",
			}],

		};

		let biomass = {
			x: biomassDates,  //["2019-01-01", "2019-03-01", "2019-06-01", "2019-09-03"],
			y: biomassValues, //[0, 15, 19, 21],
			name: "Biomass",
			type: "scatter",
			mode: "lines",
			line: {color: "DeepSkyBlue"}
		};

		let cn = {
			x: cnDates, //["2019-01-01", "2019-03-01", "2019-06-01", "2019-09-03"],
			y: cnValues, //[0, 3, 10, 13],
			name: "C:N",
			yaxis: "y2",
			type: "scatter",
			mode: "lines", //lines+marks
			line: {color: "Orange"}
		};

		let planting = {
			x: [plantingDate, plantingDate],
			y: [0, ymax],
			name: "IN",
			type: "scatter",
			mode: "lines",
			line: {color: "Black"},
			showlegend: false
		};

		let harvest = {
			x: [harvestDate, harvestDate],
			y: [0, ymax],
			name: "OUT",
			type: "scatter",
			mode: "lines",
			line: {color: "Black"},
			showlegend: false
		};

		// let data = [biomass, cn, planting, harvest];
		let data = [biomass, cn];

		let highlightShapes = [
			{
				type: "rect",
				xref: "x",
				yref:"paper",
				x0: harvestDateMin,
				y0: 0,
				x1: harvestDateMax,
				y1: 1,
				fillcolor: "LightYellow",
				opacity: 0.5,
				layer: "below",
				line: {width: 1, dash: "dot"}
			},
			{
				type: "line",
				xref: "x",
				yref:"paper",
				x0: plantingDate,
				y0: 0,
				x1: plantingDate,
				y1: 1.1,
				line: {width: 2}
			},
			{
				type: "line",
				xref: "x",
				yref:"paper",
				x0: harvestDate,
				y0: 0,
				x1: harvestDate,
				y1: 1.1,
				line: {width: 2}
			}
		];

		let annotations = [
			{
				x: plantingDate,
				y: 1,
				xref: "x",
				yref: "paper",
				text: " IN ",
				borderpad: 4,
				bgcolor: "SlateGray",
				showarrow: false,
				font: {
					size: 14,
					color: "White"
				},
				opacity: 0.8,
				// arrowhead: 3,
				// ax: -30,
				// ay: -40,
				//yanchor: "top",
				xshift: -20
			},
			{
				x: harvestDate,
				y: 1,
				xref: "x",
				yref: "paper",
				text: "OUT",
				showarrow: false,
				borderpad: 4,
				bgcolor: "SlateGray",
				font: {
					size: 14,
					color: "White"
				},
				opacity: 0.8,
				// arrowhead: 3,
				// ax: -30,
				// ay: -40,
				//yanchor: "top",
				xshift: -22

			}
		];

		let layout = {
			title: "Cover Crop Patterns",
			xaxis: {
				rangeselector: selectorOptions,
				rangeslider: {borderwidth: 1, range: ["2018-04-02", "2018-10-01"]}, //TODO: Default to current time range
				showline: true,
				linecolor: "LightGray",
				zeroline: true,
				ticks: "outside"
			},
			yaxis: {
				title: "",
				tickfont: {color: "DeepSkyBlue"},
				showgrid: false,
				showline: true,
				linecolor: "LightGray",
				ticks: "outside"
				// range: [0,5000],
				// rangemode: "tozero"
			},
			yaxis2: {
				title: "",
				// titlefont: {color: "red"},
				tickfont: {color: "Orange"},
				overlaying: "y",
				side: "right",
				showgrid: false,
				showline: true,
				linecolor: "LightGray",
				ticks: "outside"
				// rangemode: "tozero"
				// range: [8,9],

			},
			shapes: highlightShapes,
			annotations: annotations,
			legend: {x:0.9, y: 1.35, borderwidth: 0.5}
		};

		// yaxis: {
		// 	fixedrange: true
		// }


		resultHtml.push(
					<div >
						<Plot style={{ maxWidth: "800px"}}
							data={data}
							layout={layout}
							config={{
								"displayModeBar": false
							}}

						/>
					</div>);

		return resultHtml;
	}

	// Generate and return charts HTML content
	generateTableHTML() {
		let html = [];
		let rowElems = [];

		rowElems.push(
			<TableRow key="1">
				<TableCell style={{width: "140px", padding: "10px"}}>
					<span style={{fontWeight: "bold"}}>Biomass</span> <br/>
					<span style={{fontWeight: "light", fontStyle: "italic"}}>(lb/acre)</span>
				</TableCell>
				<TableCell>2362</TableCell>
				<TableCell>1934</TableCell>
			</TableRow>
		);
		rowElems.push(
			<TableRow key="2">
				<TableCell style={{width: "140px", padding: "10px"}}>
					<span style={{fontWeight: "bold"}}>C:N</span>
				</TableCell>
				<TableCell>8.4</TableCell>
				<TableCell>8.3</TableCell>
			</TableRow>
		);
		rowElems.push(
			<TableRow key="3">
				<TableCell style={{width: "140px", padding: "10px"}}>
					<span style={{fontWeight: "bold"}}>Nitrogen Update </span> <br/>
					<span style={{fontWeight: "light", fontStyle: "italic"}}>(lb/acre)</span>
				</TableCell>
				<TableCell>23.1</TableCell>
				<TableCell>19.3</TableCell>
			</TableRow>
		);

		html.push(
			<Table style={{borderStyle: "solid",
				borderColor: "rgb(224,224,224)", borderWidth: 1}}>

				<TableHead>
					<TableRow style={{height: "64px"}}>
						<TableCell style={{width: "140px", padding: "10px"}}>Cover Crop?</TableCell>
						<TableCell >YES</TableCell>
						<TableCell >NO</TableCell>
					</TableRow>
				</TableHead>

				{rowElems}

			</Table>
		);

		return html;
	}


	render() {
		return (
			<div>

				{/*{this.generateChartsHTML()}*/}

				{/*{this.generateTableHTML()}*/}

				<Table style={{maxWidth: "1200px", borderStyle: "solid",
					borderColor: "rgb(224,224,224)", borderWidth: 1}}>

					<TableHead>
						<TableRow style={{height: "64px", backgroundColor: "#EDEBEB"}}>
							<TableCell ></TableCell>
							<TableCell ><h3>Cover Crop Termination on 09/01/2019 </h3></TableCell>
						</TableRow>
						<TableRow style={{}}>
							<TableCell  style={{minWidth: "400px", padding: 0, margin: 0}}>{this.generateChartsHTML()}</TableCell>
							<TableCell style={{maxWidth: "300px", padding: 0, margin: 0,
								borderLeftStyle: "solid", borderColor: "#D8D8D8", borderWidth: "1px",
								verticalAlign: "top"
							}}>
								{this.generateTableHTML()}

								<div style={{margin: "10px"}}>
									<h3 >Other Recommendations</h3>
									Thought experiments (Gedankenexperimenten) are “facts” in the
									sense that they have a “real life” correlate in the form of electrochemical
									activity in the brain.
									But it is quite obvious that they do not relate to facts “out there”........... ...................... .
									........... ........... ...........
								</div>

							</TableCell>
						</TableRow>
					</TableHead>

				</Table>

			</div>


		);
	}
}

const mapStateToProps = (state) => {
	return {
		withCoverCropChartDataArray: state.analysis.withCoverCropResultJson,
		withoutCoverCropChartDataArray: state.analysis.withoutCoverCropResultJson,
		userInputJson: state.analysis.userInputJson
	};
};

export default connect(mapStateToProps, null)(DashboardResults);
