import React, {Component} from "react";
import {Line} from 'react-chartjs-2';

class ChartCC extends Component {

	constructor(props) {
		super(props);
		this.generateCharts = this.generateCharts.bind(this);
		this.generateChartsHTML = this.generateChartsHTML.bind(this);
		this.generateColors = this.generateColors.bind(this);
		this.colorsWithAlpha = [];
		this.colorsWithoutAlpha = [];

		this.generateColors();
	}

	generateColors() {

		const colorPalette = require('nice-color-palettes');
		const hexToRgba = require("hex-to-rgba");
		const colorPaletteIndex = 6; // Specific palette to choose

		for (let colorIndex = 0; colorIndex < colorPalette[colorPaletteIndex]["length"]; colorIndex++) {
			this.colorsWithAlpha.push(hexToRgba(colorPalette[colorPaletteIndex][colorIndex].toString(), 0.4));
			this.colorsWithoutAlpha.push(hexToRgba(colorPalette[colorPaletteIndex][colorIndex].toString(), 1));
		}
	}

	// Based on the input dataset label, return the color index from the current palette
	static chooseColorIndexByDatasetLabel(datasetLabel) {

		if (datasetLabel.toLowerCase().indexOf("corn") !== -1) {

			return 3; // similar to yellow
		}
		else if (datasetLabel.toLowerCase().indexOf("soybean") !== -1) {

			return 4; // similar to green
		}
		else if (datasetLabel.toLowerCase().indexOf("rye") !== -1) {

			return 1; // similar to red
		}
		else {

			return 0;
		}

	}

	// Generates charts array object containing individual charts and datasets
	generateCharts(chartArrayTypeName, chartDataArray) {
		let labelArray = ['2009-07-01', '2010-04-01', '2010-07-01', '2011-04-01', '2011-07-01', '2012-01-01', '2012-07-01', '2013-01-01', '2013-07-01', '2013-12-01'];
		let colorIndex = 0;
		let datasetBorderDash = (chartArrayTypeName === "withCoverCropChartDataArray") ? [] : [10, 5];

		if (this.props.hasOwnProperty(chartArrayTypeName)) {
			// Iterate over each chart
			for (let dataIndex = 0; dataIndex < this.props[chartArrayTypeName].length; dataIndex++) {
				let chartRawData = this.props[chartArrayTypeName][dataIndex];

				// Set chart options
				let chartOptions = {
					title: {
						text: chartRawData.title,
						display: true
					},
					scales: {
						xAxes: [{
							scaleLabel: {
								display: true,
								labelString: chartRawData.xAxis
							},
							gridLines: {
								lineWidth: 2
							},
							type: 'time',
							time: {
								unit: chartRawData.xAxisUnit.toLowerCase(),
								unitStepSize: 4,
								displayFormats: {
									month: 'YYYY MMM',
								},
								tooltipFormat: 'MM/DD/YYYY'
							}
						}],
						yAxes: [{
							scaleLabel: {
								display: true,
								labelString: chartRawData.yAxis + ' (' + chartRawData.yAxisUnit + ')'
							}
						}],
					}
				};

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
							})
						}
					}

					// Create dataset object with appropriate options and data
					colorIndex = ChartCC.chooseColorIndexByDatasetLabel(rawDatasets[datasetIndex].dataset_label);
					let datasetColor = (chartArrayTypeName === "withCoverCropChartDataArray") ? this.colorsWithoutAlpha[colorIndex] : this.colorsWithAlpha[colorIndex];
					let datasetLabel = (chartArrayTypeName === "withCoverCropChartDataArray") ? "w/ Cover Crop" : "w/o Cover Crop";
					let dataset = {
						label: datasetLabel,
						fill: false,
						lineTension: 0.1,
						backgroundColor: datasetColor,
						borderColor: datasetColor,
						borderCapStyle: 'butt',
						borderDash: datasetBorderDash,
						borderDashOffset: 0.0,
						borderJoinStyle: 'miter',
						pointBorderColor: datasetColor,
						pointBackgroundColor: '#fff',
						pointBorderWidth: 1,
						pointHoverRadius: 5,
						pointHoverBackgroundColor: datasetColor,
						pointHoverBorderColor: datasetColor,
						pointHoverBorderWidth: 2,
						pointRadius: 1,
						pointHitRadius: 10,
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
					chartDataArray[chartRawData.variable].chartData.datasets = chartDataArray[chartRawData.variable].chartData.datasets.concat(parsedDatasets)
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

	// Generate and return charts HTML content
	generateChartsHTML() {

		let resultHtml = [];
		let keys = [];
		let chartDataArray = {}; // Associative array to store chart data

		this.generateCharts("withCoverCropChartDataArray", chartDataArray); // generate charts for with cover crop case
		this.generateCharts("withoutCoverCropChartDataArray", chartDataArray); // generate charts for without cover crop case

		console.log("Charts array: ")
		console.log(chartDataArray);

		// sort keys
		for (let key in chartDataArray) keys.push(key);
		keys.sort();

		for (let chartIndex = 0; chartIndex < keys.length; chartIndex++){

			let chartData = chartDataArray[keys[chartIndex]].chartData;
			let chartOptions = chartDataArray[keys[chartIndex]].chartOptions;

			resultHtml.push(<Line key={"line-" + chartIndex} data={chartData} options={chartOptions}/>);
			resultHtml.push(<hr key={"hr-" + chartIndex}/>);
			resultHtml.push(<br key={"br-" + chartIndex}/>);
		}

		return resultHtml;
	}

	render() {

		return (
			<div>{this.generateChartsHTML()}</div>
		)
	}

}

export default ChartCC;
