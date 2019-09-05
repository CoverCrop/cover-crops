import React, {Component} from "react";
import { connect } from "react-redux";

class DashboardResults extends Component {

	constructor(props) {
		super(props);
		this.generateChartsHTML = this.generateChartsHTML.bind(this);
	}


	// Generate and return charts HTML content
	generateChartsHTML() {

		let resultHtml = [];

				resultHtml.push(
					<div>
						DASHBOARD GOES HERE
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
