import React, {Component} from "react";
import { connect } from "react-redux";

import {convertDateToUSFormat, convertDateToUSFormatShort,
	roundResults, calculateDayDifference} from "../public/utils";
import config from "../app.config";

// import Plot from "react-plotly.js";
//TODO: Performance took a hit. Bundle size increased from 6 MB to 13 MB

// customizable method: use your own `Plotly` object - Improve performance
//plotly-basic.min is supposed to have most features we need, we can use it
// instead and decrease size by 3 MB
import Plotly from "plotly.js/dist/plotly.min";
import createPlotlyComponent from "react-plotly.js/factory";
import styles from "../styles/main.css";
import Slider from "@material-ui/core/Slider";

import { withStyles } from "@material-ui/core/styles";

import {
	Table,
	TableBody,
	TableCell,
	TableRow,
	TableHead,

} from "@material-ui/core";


const Plot = createPlotlyComponent(Plotly);

const windowDurationDays = 28; // must be even. Can be moved to config
const harvestDay = windowDurationDays/2; // 0 indexed middle day of the harvest duration
const day = 60 * 60 * 24 * 1000; //day in millisecs

const DateSlider = withStyles ({
	root: {
		width: "800px",
		color: "#52af77",
	},
	rail: {
		height: 6,
		borderRadius: 2
	},
	mark: {
		backgroundColor: "#bfbfbf",
		height: 14,
		// width: 2,
		marginTop: -4,
	},
	markLabel: {
		fontSize: 14
	},
	thumb: {
		height: 20,
		width: 20,
		backgroundColor: "#fff",
		border: "2px solid currentColor",
		marginTop: -8,
		marginLeft: -12,
		"&:focus,&:hover,&$active": {
			boxShadow: "inherit",
		},
	},
})(Slider);

//TODO: Replace all references to "harvest" to "cashCropPlanting". ex: harvestDate to cashCropPlantingDate
class DashboardResults extends Component {

	constructor(props) {
		super(props);

		this.state = {
			ccDataArray: null,
			noccDataArray: null,
			plantingDate: new Date(),
			harvestDate: new Date(),
			plantingDateStr: "",
			harvestDateStr: "",
			harvestDates: [],
			selHarvestDateId: harvestDay,
			selHarvestDate: new Date()
		};

		this.generateChartsHTML = this.generateChartsHTML.bind(this);
		this.generateTableHTML = this.generateTableHTML.bind(this);
		this.handleMuiChange = this.handleMuiChange.bind(this);
		this.getYfromArray = this.getYfromArray.bind(this);
	}

	componentWillReceiveProps(nextProps, nextContext) {

		let plantingDate = new Date();
		let harvestDate = new Date();

		if (nextProps.hasOwnProperty("userInputJson") && nextProps["userInputJson"] !== null && nextProps["userInputJson"] !== undefined) {
			let plantingYear = nextProps["userInputJson"]["year_planting"];
			let harvestYear = plantingYear + 1;
			let plantingDOY = nextProps["userInputJson"]["doy_planting"];
			let harvestDOY = nextProps["userInputJson"]["doy_harvest"] - config.coverCropTerminationOffsetDays;
			plantingDate = new Date(plantingYear, 0, plantingDOY);
			harvestDate = new Date(harvestYear, 0, harvestDOY);

			let harvestDateMin = new Date(harvestYear, 0, harvestDOY - (windowDurationDays/2));
			let harvestDateMax = new Date(harvestYear, 0, harvestDOY + (windowDurationDays/2));

			this.setState({plantingDate: plantingDate});
			this.setState({harvestDate: harvestDate});
			this.setState({selHarvestDate: harvestDate});
			this.setState({plantingDateStr: convertDateToUSFormat(plantingDate)});
			this.setState({harvestDateStr: convertDateToUSFormat(harvestDate)});

			let sliderSteps = [];
			let incrementMark = 7;
			let stepDate = harvestDateMin;
			let val = 0;
			while(stepDate <= harvestDateMax){

				sliderSteps.push({
					label: (val%incrementMark === 0) ? convertDateToUSFormatShort(stepDate): "",
					value: val,
					date: stepDate
				});

				stepDate = new Date(stepDate.getTime() + day);
				val++;
			}

			this.setState({harvestDates: sliderSteps});

			let ccDataArray = this.getDashboardDataArray(nextProps,"withCoverCropChartDataArray", plantingDate, harvestDate);
			let noccDataArray = this.getDashboardDataArray(nextProps,"withoutCoverCropChartDataArray", plantingDate, harvestDate);

			this.setState({ccDataArray: ccDataArray});
			this.setState({noccDataArray: noccDataArray});
		}
	}

	getHarvestDateFromId(harvestDates, id){
		let retVal = harvestDay;
		harvestDates.forEach(e => {
			if(e.value === id){
				retVal =  e.date;
			}
		});
		return retVal;
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

	handleMuiChange = name => (event, value) => {
		this.setState({[name]:  value });
		let selHarvestDate = this.getHarvestDateFromId(this.state.harvestDates, value);
		this.setState({selHarvestDate: selHarvestDate});
	};

	// Generates charts array object containing individual charts and datasets
	getDashboardDataArray(properties, chartArrayTypeName, plantingDate, harvestDate) {

		let chartDataArray = {};
		let minTime = plantingDate.getTime();
		let maxTime = harvestDate.getTime();
		//
		// console.log(new Date(minTime));
		// console.log(new Date(maxTime));

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
		let rangeSelectorMin = new Date();
		let rangeSelectorMax = new Date();
		let ccChartDataArray = {}; // Associative array to store chart data
		let biomassDates = [];
		let biomassValues = [];
		let cnDates = [];
		let cnValues = [];
		let cnMax = 60;

		let cnRows = [];
		let biomassRows = [];

		if (this.props.hasOwnProperty("userInputJson") && this.props["userInputJson"] !== null && this.props["userInputJson"] !== undefined) {

			let plantingYear = this.props["userInputJson"]["year_planting"];
			let harvestYear = plantingYear + 1;
			let plantingDOY = this.props["userInputJson"]["doy_planting"];
			let harvestDOY = this.props["userInputJson"]["doy_harvest"] - config.coverCropTerminationOffsetDays;
			plantingDate = new Date(plantingYear, 0, plantingDOY);
			harvestDate = new Date(harvestYear, 0, harvestDOY);

			harvestDateMin = new Date(harvestYear, 0, harvestDOY - (windowDurationDays/2));
			harvestDateMax = new Date(harvestYear, 0, harvestDOY + (windowDurationDays/2));
			rangeSelectorMin = new Date(plantingYear, 0, plantingDOY - windowDurationDays);
			rangeSelectorMax = new Date(harvestYear, 0, harvestDOY + windowDurationDays);
		}

		ccChartDataArray = this.state.ccDataArray;// generate charts for with cover crop case
		// console.log("dashboard array: ");
		// console.log(ccChartDataArray);
		for (let key in ccChartDataArray) {
			if(key.toString() === "C:N ratio"){
				if(ccChartDataArray[key].chartData !== undefined && ccChartDataArray[key].chartData.datasets.length) {
					cnRows = ccChartDataArray[key].chartData.datasets[0].data;
				}
			}

			if(key.toString() === "TWAD"){
				if(ccChartDataArray[key].chartData !== undefined && ccChartDataArray[key].chartData.datasets.length) {
					biomassRows = ccChartDataArray[key].chartData.datasets[0].data;
				}
			}
		}

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

		cnMax = Math.max(...cnValues);
		if(cnMax < 21){
			cnMax = 26;
		}

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
			y: 1.15,
			buttons: [
			// 	{
			// 	step: "month",
			// 	stepmode: "backward",
			// 	count: 1,
			// 	label: "1m"
			// }, {
			// 	step: "month",
			// 	stepmode: "backward",
			// 	count: 6,
			// 	label: "6m"
			// }, {
			// 	step: "year",
			// 	stepmode: "todate",
			// 	count: 1,
			// 	label: "YTD"
			// }, {
			// 	step: "year",
			// 	stepmode: "backward",
			// 	count: 1,
			// 	label: "1y"
			// },
				{
				step: "all",
				label: "show all"
			}],

		};

		let biomass = {
			x: biomassDates,  //["2019-01-01", "2019-03-01", "2019-06-01", "2019-09-03"],
			y: biomassValues, //[0, 15, 19, 21],
			name: "Plant Biomass",
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
				fillcolor: "rgb(204, 255, 235)", //"LightYellow",
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
			},
			{
				type: "rect",
				xref: "paper",
				yref:"y2",
				x0: 0,
				y0: 0,
				x1: 1,
				y1: 20,
				fillcolor: "rgb(240, 240, 194)",
				opacity: 0.3,
				layer: "below",
				line: {width: 0.1}
			},
			{
				type: "rect",
				xref: "paper",
				yref:"y2",
				x0: 0,
				y0: 20,
				x1: 1,
				y1: cnMax,
				fillcolor: "rgb(240, 220, 220)",
				opacity: 0.3,
				layer: "below",
				line: {width: 0.1}
			},
		];

		let annotations = [
			{
				x: plantingDate,
				y: 1.06,
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
				y: 1.06,
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

			},
			// {
			// 	text: "Immobilization Begins<sup>*</sup>",
			// 	showarrow: true,
			// 	x: 0.5,
			// 	y: 20.25,
			// 	valign: "top",
			// 	xref:"paper",
			// 	yref: "y2",
			// 	// borderwidth: 1,
			// 	// bordercolor: "black",
			// 	// hovertext: "Termination of CR with a C:N ratio ranging from 0-20 has the potential to result in soil N mineralization <br>" +
			// 	// 	"Termination of CR with a C:N ratio ranging >20 has the potential to result in soil N immobilization",
			// }
		];

		let layout = {
			title: "Cover Crop Growth & C:N Prediction",
			width: 930,
			height: 600,
			// responsive: true,
			xaxis: {
				rangeselector: selectorOptions,
				rangeslider: {borderwidth: 1},
				range: [rangeSelectorMin, rangeSelectorMax],
				showline: true,
				linecolor: "LightGray",
				zeroline: true,
				ticks: "outside"
			},
			yaxis: {
				title: {
					text: "Plant Biomass (lb/acre)",
					font: {
						color: "DeepSkyBlue"
					}
				},
				tickfont: {color: "DeepSkyBlue"},
				showgrid: false,
				showline: true,
				linecolor: "LightGray",
				ticks: "outside"
				// range: [0,5000],
				// rangemode: "tozero"
			},
			yaxis2: {
				title: {
					text: "C:N",
					font: {
						color: "Orange"
					}
				},
				tickfont: {color: "Orange"},
				overlaying: "y",
				side: "right",
				showgrid: false,
				showline: true,
				linecolor: "LightGray",
				ticks: "outside"
			},
			shapes: highlightShapes,
			annotations: annotations,
			legend: {x:0.88, y: 1.40, borderwidth: 0.5}
		};


		resultHtml.push(
					<div >
						<Plot
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
	generateTableHTML(harvestDate) {
		let html = [];
		let rowElems = [];

		if(harvestDate == null){
			harvestDate = this.state.harvestDate;
		}

		rowElems.push(
			<TableRow key="1">
				<TableCell className="dashboardTableHeader">
					<span style={{fontWeight: "bold"}}>Plant Biomass</span> <br/>
					<span style={{fontWeight: "light", fontStyle: "italic"}}>(lb/acre)</span>
				</TableCell>
				<TableCell> {(this.state.ccDataArray !== null && this.state.ccDataArray["TWAD"].chartData.datasets[0] != null) ?
						this.getYfromArray(this.state.ccDataArray["TWAD"].chartData.datasets[0].data, harvestDate): "NA"
				}
				</TableCell>

			</TableRow>
		);
		rowElems.push(
			<TableRow key="2">
				<TableCell className="dashboardTableHeader">
					<span style={{fontWeight: "bold"}}>C:N</span>
				</TableCell>

				<TableCell> {(this.state.ccDataArray !== null && this.state.ccDataArray["C:N ratio"].chartData.datasets[0] != null) ?
					this.getYfromArray(this.state.ccDataArray["C:N ratio"].chartData.datasets[0].data, harvestDate): "NA"
				}
				</TableCell>
			</TableRow>
		);
		rowElems.push(
			<TableRow key="3">
				<TableCell className="dashboardTableHeader">
					<span style={{fontWeight: "bold"}}>Nitrogen Uptake </span> <br/>
					<span style={{fontWeight: "light", fontStyle: "italic"}}>(lb/acre)</span>
				</TableCell>
				<TableCell> {(this.state.ccDataArray !== null && this.state.ccDataArray["NUAD"].chartData.datasets[0] != null) ?
					this.getYfromArray(this.state.ccDataArray["NUAD"].chartData.datasets[0].data, harvestDate): "NA"
				}
				</TableCell>
			</TableRow>
		);
		rowElems.push(
			<TableRow key="4">
				<TableCell className="dashboardTableHeader">
					<span style={{fontWeight: "bold"}}>Nitrogen Decomposition </span> <br/>
					<span style={{fontWeight: "light", fontStyle: "italic"}}>(lb/acre)</span>
				</TableCell>
				<TableCell> {(this.state.ccDataArray !== null && this.state.ccDataArray["NLTD"].chartData.datasets[0] != null &&
						this.state.noccDataArray !== null && this.state.noccDataArray["NLTD"].chartData.datasets[0] != null) ?
						roundResults(this.getYfromArray(this.state.noccDataArray["NLTD"].chartData.datasets[0].data, harvestDate)
								- this.getYfromArray(this.state.ccDataArray["NLTD"].chartData.datasets[0].data, harvestDate), 2) : "NA"
				}
				</TableCell>
			</TableRow>
		);

		rowElems.push(
			<TableRow key="5">
				<TableCell className="dashboardTableHeader">
					<span style={{fontWeight: "bold"}}>Total Soil Inorganic Nitrogen </span> <br/>
					<span style={{fontWeight: "light", fontStyle: "italic"}}>(lb/acre)</span>
				</TableCell>
				<TableCell> {(this.state.ccDataArray !== null && this.state.ccDataArray["NIAD"].chartData.datasets[0] != null) ?
					this.getYfromArray(this.state.ccDataArray["NIAD"].chartData.datasets[0].data, harvestDate): "NA"
				}
				</TableCell>
			</TableRow>
		);

		html.push(
			<Table style={{borderStyle: "solid",
				borderColor: "rgb(224,224,224)", borderWidth: 1}}>

				<TableHead>
					<TableRow style={{height: "64px"}}>
						<TableCell style={{textAlign: "center", fontWeight:700}} colSpan={2}>Results with Cover Crop</TableCell>
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

				<Table style={{ borderStyle: "solid",
					borderColor: "rgb(224,224,224)", borderWidth: 1}}>

					<TableHead>
						<TableRow style={{height: "64px", backgroundColor: "#EDEBEB"}}>

							<TableCell colSpan={2} style={{textAlign: "right"}}>
								<h3>Cash Crop Planting on {convertDateToUSFormat(this.state.selHarvestDate)} </h3>
							</TableCell>
						</TableRow>
						<TableRow style={{verticalAlign: "top"}}>
							<TableCell  style={{width: "100%", padding: 0, margin: 0}}>
								<div style={{textAlign: "center"}}>
									{this.generateChartsHTML()}
									<div style={{fontSize: "1.125em"}}>
										Select a cash crop planting date
									</div>
									<DateSlider
											defaultValue={harvestDay}
											track={false}
											min={0}
											max={windowDurationDays}
											step={1}
											marks={this.state.harvestDates}
											// valueLabelDisplay="on"
											onChange={this.handleMuiChange("selHarvestDateId")}
											value={this.state.selHarvestDateId}
									/>

								</div>
							</TableCell>
							<TableCell style={{minWidth: "250px", padding: 0, margin: 0,
								borderLeftStyle: "solid", borderColor: "#D8D8D8", borderWidth: "1px",
								verticalAlign: "top"
							}}>
								{this.generateTableHTML(this.state.selHarvestDate)}

								<div style={{margin: "10px"}}>
									<h3> Notes </h3>
									<sup>*</sup> Termination of CR with a C:N ratio ranging from 0-20 has the potential to result in soil N mineralization. <br/>
									<sup>*</sup> Termination of CR with a C:N ratio ranging >20 has the potential to result in soil N immobilization. <br/>
									<sup>*</sup> N immobilization happens above the yellow region in the graph.
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
