import React, {Component} from "react";
import { connect } from "react-redux";

// import Plot from "react-plotly.js";
//TODO: Performance took a hit. Bundle size increased from 6 MB to 13 MB

// customizable method: use your own `Plotly` object - Improve performance
//plotly-basic.min is supposed to have most features we need, we can use it
// instead and decrease size by 3 MB
import Plotly from "plotly.js/dist/plotly.min";
import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);

class DashboardResults extends Component {

	constructor(props) {
		super(props);
		this.generateChartsHTML = this.generateChartsHTML.bind(this);
	}


	// Generate and return charts HTML content
	generateChartsHTML() {

		let resultHtml = [];
		let selectorOptions = {
			buttons: [{
				step: "month",
				stepmode: "backward",
				count: 1,
				label: "1m"
			}, {
				step: "month",
				stepmode: "backward",
				// count: 6,
				label: "6m"
			}, {
				step: "year",
				stepmode: "todate",
				count: 1,
				label: "YTD"
			// }, {
			// 	step: "year",
			// 	stepmode: "backward",
			// 	count: 1,
			// 	label: "1y"
			}, {
				step: "all",
			}],
		};

		let biomass = {
			x: ["2019-01-01", "2019-03-01", "2019-06-01", "2019-09-03"],
			y: [0, 15, 19, 21],
			name: "Biomass",
			type: "scatter",
			mode: "lines",
			line: {color: "DeepSkyBlue"}
		};

		let cn = {
			x: ["2019-01-01", "2019-03-01", "2019-06-01", "2019-09-03"],
			y: [0, 3, 10, 13],
			name: "C:N",
			yaxis: "y2",
			type: "scatter",
			mode: "lines", //lines+marks
			line: {color: "Orange"}
		};

		let data = [biomass, cn];

		let layout = {
			title: "Cover Crop Patterns",
			xaxis: {
				rangeselector: selectorOptions,
				rangeslider: {borderwidth: 1}
			},
			yaxis: {
				title: "",
				tickfont: {color: "DeepSkyBlue"},
				showgrid: false
			},
			yaxis2: {
				title: "",
				// titlefont: {color: "red"},
				tickfont: {color: "Orange"},
				overlaying: "y",
				side: "right",
				showgrid: false
			}
		};

		// yaxis: {
		// 	fixedrange: true
		// }


		resultHtml.push(
					<div>
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

	render() {
		return (
				<div className="line-chart-parent-div">{this.generateChartsHTML()}</div>
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
