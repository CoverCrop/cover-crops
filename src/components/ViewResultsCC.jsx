import React, {Component} from "react";
import {Button, Textfield, Body1} from "react-mdc-web"
import ChartCC from "./ChartCC";

class ViewResultsCC extends Component {

	constructor(props) {
		super(props);
	}

	render(){

		return(
			<div>
				<h1>Results</h1>
				<br/>
				<ChartCC withCoverCropChartDataArray={this.props.state.withCoverCropResultJson.charts} withoutCoverCropChartDataArray={this.props.state.withoutCoverCropResultJson.charts}/>
			</div>
		)
	}
}

export default ViewResultsCC;
