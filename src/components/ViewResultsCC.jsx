import React, {Component} from "react";
import ChartCC from "./ChartCC";
import { connect } from "react-redux";
import {selectedEventNotSuccessful} from "../app.messages";

class ViewResultsCC extends Component {

	render() {
		return (
			<div>
				<h1>Results</h1>
				<br/>
				{/*TODO: This is going to not work due to change in isSelectedEventSuccessful data type from boolean to string.
				TODO: Can this component be removed altogether?*/}
				{this.props.isSelectedEventSuccessful ? <ChartCC /> : <p className="error-message">{selectedEventNotSuccessful}</p>}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isSelectedEventSuccessful: state.user.isSelectedEventSuccessful
	};
};

export default connect(mapStateToProps, null)(ViewResultsCC);
