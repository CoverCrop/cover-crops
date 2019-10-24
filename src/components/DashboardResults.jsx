import React, {Component} from "react";
import { connect } from "react-redux";

import {convertDateToUSFormat, convertDateToUSFormatShort,
	roundResults, calculateDayDifference} from "../public/utils";

// import Plot from "react-plotly.js";
//TODO: Performance took a hit. Bundle size increased from 6 MB to 13 MB

// customizable method: use your own `Plotly` object - Improve performance
//plotly-basic.min is supposed to have most features we need, we can use it
// instead and decrease size by 3 MB
import Plotly from "plotly.js/dist/plotly.min";
import createPlotlyComponent from "react-plotly.js/factory";
import {Grid, Cell} from "react-mdc-web";
import styles from "../styles/main.css";

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

		this.state = {
			ccDataArray: null,
			noccDataArray: null,
			plantingDate: new Date(),
			harvestDate: new Date(),
			plantingDateStr: "",
			harvestDateStr: ""
		};

		this.generateChartsHTML = this.generateChartsHTML.bind(this);
		this.generateTableHTML = this.generateTableHTML.bind(this);
		this.getYfromArray = this.getYfromArray.bind(this);
	}

	componentWillReceiveProps(nextProps, nextContext) {
		console.log(nextProps);

		let plantingDate = new Date();
		let harvestDate = new Date();
		let harvestDateMin = new Date();
		let harvestDateMax = new Date();

		if (nextProps.hasOwnProperty("userInputJson") && nextProps["userInputJson"] !== null && nextProps["userInputJson"] !== undefined) {
			let plantingYear = nextProps["userInputJson"]["year_planting"];
			let harvestYear = plantingYear + 1;
			let plantingDOY = nextProps["userInputJson"]["doy_planting"];
			let harvestDOY = nextProps["userInputJson"]["doy_harvest"];
			plantingDate = new Date(plantingYear, 0, plantingDOY);
			harvestDate = new Date(harvestYear, 0, harvestDOY);

			console.log("mount");
			this.setState({plantingDate: plantingDate});
			this.setState({harvestDate: harvestDate});
			this.setState({plantingDateStr: convertDateToUSFormat(plantingDate)});
			this.setState({harvestDateStr: convertDateToUSFormat(harvestDate)});

			console.log(nextProps);
			let ccDataArray = this.getDashboardDataArray(nextProps,"withCoverCropChartDataArray", plantingDate, harvestDate);
			let noccDataArray = this.getDashboardDataArray(nextProps,"withoutCoverCropChartDataArray", plantingDate, harvestDate);

			this.setState({ccDataArray: ccDataArray});
			this.setState({noccDataArray: noccDataArray});
		}
	}

	getYfromArray(arr, x){
		let ret = "NA";
		arr.map(function(item){
			if(item.x.getTime() === x.getTime()){
				ret = item.y;
			}
		});

		if (ret !== "NA") {
			return roundResults(ret, 2);
		} else {
			return ret;
		}
	}


	// Generates charts array object containing individual charts and datasets
	getDashboardDataArray(properties, chartArrayTypeName, plantingDate, harvestDate) {
		console.log(properties);
		let chartDataArray = {};
		let colorIndex = 0;
		let minTime = plantingDate.getTime();
		let maxTime = harvestDate.getTime();

		console.log(new Date(minTime));
		console.log(new Date(maxTime));

		let chartOptions = {};

		if (properties.hasOwnProperty(chartArrayTypeName) && properties[chartArrayTypeName] !== null) {
			if(properties[chartArrayTypeName].hasOwnProperty("charts")){
				// Iterate over each chart
				let charts =  properties[chartArrayTypeName].charts;
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
		let ccChartDataArray = {}; // Associative array to store chart data
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

			// this.setState({plantingDate: plantingDate.toDateString()});
			// this.setState({harvestDate: harvestDate.toDateString()});

			harvestDateMin = new Date(harvestYear, 0, harvestDOY - 7);
			harvestDateMax = new Date(harvestYear, 0, harvestDOY + 7);

			console.log(plantingDate);
			console.log(harvestDateMin);
			console.log(harvestDateMax);

		}

		ccChartDataArray = this.state.ccDataArray;// generate charts for with cover crop case
		console.log("dashboard array: ");
		console.log(ccChartDataArray);
		for (let key in ccChartDataArray) {
			if(key.toString() === "C:N ratio"){
				cnRows = ccChartDataArray[key].chartData.datasets[0].data;
			}

			if(key.toString() === "TWAD"){
				biomassRows = ccChartDataArray[key].chartData.datasets[0].data;
			}
		}

		console.log(cnRows);
		console.log(biomassRows);
		let day = 60 * 60 * 24 * 1000;

		let prevCnDate = null;
		cnRows.forEach(function(element) {
			let dt = element.x;

			// Adds 0s for missing date to make graph cleaner
			if(prevCnDate != null){
				let dayDiff = calculateDayDifference(prevCnDate, dt);
				while(dayDiff > 1){
					let newDate = new Date(prevCnDate.getTime() + day);
					cnDates.push(newDate);
					cnValues.push(null);
					dayDiff--;
					prevCnDate = newDate;
				}
			}

			cnDates.push(dt);
			cnValues.push(element.y);
			prevCnDate = element.x;
		});

		let prevBiomassDate = null;
		biomassRows.forEach(function(element) {
			let dt = element.x;

			// Adds 0s for missing date to make graph cleaner
			if(prevBiomassDate != null){
				let dayDiff = calculateDayDifference(prevBiomassDate, dt);
				while(dayDiff > 1){
					let newDate = new Date(prevBiomassDate.getTime() + day);
					biomassDates.push(newDate);
					biomassValues.push(null);
					dayDiff--;
					prevBiomassDate = newDate;
				}
			}

			biomassDates.push(dt);
			biomassValues.push(element.y);
			prevBiomassDate = element.x;
		});


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
			connectgaps: false,
			line: {color: "DeepSkyBlue"}
		};

		let cn = {
			x: cnDates, //["2019-01-01", "2019-03-01", "2019-06-01", "2019-09-03"],
			y: cnValues, //[0, 3, 10, 13],
			name: "C:N",
			yaxis: "y2",
			type: "scatter",
			mode: "lines", //lines+marks
			connectgaps: false,
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

		let sliderDict = {
			// pad: {t: 30},
			currentvalue: {
				xanchor: "right",
				prefix: "color: ",
				font: {
					color: "#888",
					size: 20
				}
			},
			pad: { t: 50},
			len: 1,
			x: 0,
			y: 0,
			steps: [
				{
					label: convertDateToUSFormatShort(harvestDateMin),
					method: "restyle",
					args: [{frame: {duration: 300},
						mode: "immediate"}
					]
				},
				{
					label: "3/29",
					method: "restyle",
					args: [{frame: {duration: 300},
						mode: "immediate"}
					]
				},
				{
					label: "3/30",
					method: "restyle",
					args: [{frame: {duration: 300},
						mode: "immediate"}
					]
				},
				{
					label: convertDateToUSFormatShort(harvestDateMax),
					method: "restyle",
					args: [{frame: {duration: 300},
						mode: "immediate"}
					]
				}

			]
		};

		let layout = {
			title: "Cover Crop Patterns",
			sliders: [sliderDict],
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
						<Plot style={{ maxWidth: "850px"}}
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
				<TableCell className="dashboardTableHeader">
					<span style={{fontWeight: "bold"}}>Biomass</span> <br/>
					<span style={{fontWeight: "light", fontStyle: "italic"}}>(lb/acre)</span>
				</TableCell>
				<TableCell> {(this.state.ccDataArray !== null && this.state.ccDataArray["TWAD"].chartData.datasets[0] != null) ?
						this.getYfromArray(this.state.ccDataArray["TWAD"].chartData.datasets[0].data, this.state.harvestDate): "NA"
				}
				</TableCell>
				<TableCell>{(this.state.noccDataArray !== null && this.state.noccDataArray["TWAD"].chartData.datasets[0] != null) ?
					this.getYfromArray(this.state.noccDataArray["TWAD"].chartData.datasets[0].data, this.state.harvestDate): "NA"
				}</TableCell>

			</TableRow>
		);
		rowElems.push(
			<TableRow key="2">
				<TableCell className="dashboardTableHeader">
					<span style={{fontWeight: "bold"}}>C:N</span>
				</TableCell>

				<TableCell> {(this.state.ccDataArray !== null && this.state.ccDataArray["C:N ratio"].chartData.datasets[0] != null) ?
					this.getYfromArray(this.state.ccDataArray["C:N ratio"].chartData.datasets[0].data, this.state.harvestDate): "NA"
				}
				</TableCell>
				<TableCell>{(this.state.noccDataArray !== null && this.state.noccDataArray["C:N ratio"].chartData.datasets[0] != null) ?
					this.getYfromArray(this.state.noccDataArray["C:N ratio"].chartData.datasets[0].data, this.state.harvestDate): "NA"
				}</TableCell>
			</TableRow>
		);
		rowElems.push(
			<TableRow key="3">
				<TableCell className="dashboardTableHeader">
					<span style={{fontWeight: "bold"}}>Nitrogen Uptake </span> <br/>
					<span style={{fontWeight: "light", fontStyle: "italic"}}>(lb/acre)</span>
				</TableCell>
				<TableCell> {(this.state.ccDataArray !== null && this.state.ccDataArray["NUAD"].chartData.datasets[0] != null) ?
					this.getYfromArray(this.state.ccDataArray["NUAD"].chartData.datasets[0].data, this.state.harvestDate): "NA"
				}
				</TableCell>
				<TableCell>{(this.state.noccDataArray !== null && this.state.noccDataArray["NUAD"].chartData.datasets[0] != null) ?
					this.getYfromArray(this.state.noccDataArray["NUAD"].chartData.datasets[0].data, this.state.harvestDate): "NA"
				}</TableCell>
			</TableRow>
		);
		rowElems.push(
			<TableRow key="4">
				<TableCell className="dashboardTableHeader">
					<span style={{fontWeight: "bold"}}>Nitrogen Leached </span> <br/>
					<span style={{fontWeight: "light", fontStyle: "italic"}}>(lb/acre)</span>
				</TableCell>
				<TableCell> {(this.state.ccDataArray !== null && this.state.ccDataArray["NLCC"].chartData.datasets[0] != null) ?
					this.getYfromArray(this.state.ccDataArray["NLCC"].chartData.datasets[0].data, this.state.harvestDate): "NA"
				}
				</TableCell>
				<TableCell>{(this.state.noccDataArray !== null && this.state.noccDataArray["NLCC"].chartData.datasets[0] != null) ?
					this.getYfromArray(this.state.noccDataArray["NLCC"].chartData.datasets[0].data, this.state.harvestDate): "NA"
				}</TableCell>
			</TableRow>
		);
		rowElems.push(
			<TableRow key="5">
				<TableCell className="dashboardTableHeader">
					<span style={{fontWeight: "bold"}}>Nitrogen Loss </span> <br/>
					<span style={{fontWeight: "light", fontStyle: "italic"}}>(lb/acre)</span>
				</TableCell>
				<TableCell> {(this.state.ccDataArray !== null && this.state.ccDataArray["NLTD"].chartData.datasets[0] != null) ?
					this.getYfromArray(this.state.ccDataArray["NLTD"].chartData.datasets[0].data, this.state.harvestDate): "NA"
				}
				</TableCell>
				<TableCell>{(this.state.noccDataArray !== null && this.state.noccDataArray["NLTD"].chartData.datasets[0] != null) ?
					this.getYfromArray(this.state.noccDataArray["NLTD"].chartData.datasets[0].data, this.state.harvestDate): "NA"
				}</TableCell>
			</TableRow>
		);

		rowElems.push(
			<TableRow key="6">
				<TableCell className="dashboardTableHeader">
					<span style={{fontWeight: "bold"}}>Total Soil Inorganic Nitrogen </span> <br/>
					<span style={{fontWeight: "light", fontStyle: "italic"}}>(lb/acre)</span>
				</TableCell>
				<TableCell> {(this.state.ccDataArray !== null && this.state.ccDataArray["NIAD"].chartData.datasets[0] != null) ?
					this.getYfromArray(this.state.ccDataArray["NIAD"].chartData.datasets[0].data, this.state.harvestDate): "NA"
				}
				</TableCell>
				<TableCell>{(this.state.noccDataArray !== null && this.state.noccDataArray["NIAD"].chartData.datasets[0] != null) ?
					this.getYfromArray(this.state.noccDataArray["NIAD"].chartData.datasets[0].data, this.state.harvestDate): "NA"
				}</TableCell>
			</TableRow>
		);

		html.push(
			<Table style={{borderStyle: "solid",
				borderColor: "rgb(224,224,224)", borderWidth: 1}}>

				<TableHead>
					<TableRow style={{height: "64px"}}>
						<TableCell  className="dashboardTableHeader">Cover Crop?</TableCell>
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
							<TableCell  />
							<TableCell ><h3>Cover Crop Termination on {this.state.harvestDateStr} </h3></TableCell>
						</TableRow>
						<TableRow style={{}}>
							<TableCell  style={{minWidth: "500px", padding: 0, margin: 0}}>{this.generateChartsHTML()}</TableCell>
							<TableCell style={{maxWidth: "300px", padding: 0, margin: 0,
								borderLeftStyle: "solid", borderColor: "#D8D8D8", borderWidth: "1px",
								verticalAlign: "top"
							}}>
								{this.generateTableHTML()}

								<div style={{margin: "10px"}}>
									<h3 >Other Recommendations / Notes</h3>
									Add here...
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
