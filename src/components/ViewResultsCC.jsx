import React, {Component} from "react";
import {Line} from 'react-chartjs-2';
import {ChartCC} from "./ChartCC"

class ViewResultsCC extends Component {

	render() {
		return (
			<div>
				<h1>Results</h1>
				<br/>
				<ChartCC/>
			</div>
		)
	}
}

export default ViewResultsCC;
