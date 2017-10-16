import React, {Component} from "react";
import SelectFieldsCC from "./SelectFieldsCC";
import RunSimulationCC from "./RunSimluationCC";
import ViewResultsCC from "./ViewResultsCC";

class RightPaneCC extends Component {

	constructor(props) {
		super(props);

		this.handleLatFieldChange = this.handleLatFieldChange.bind(this);
		this.handleLongFieldChange = this.handleLongFieldChange.bind(this);
		this.handleStartDateChange = this.handleStartDateChange.bind(this);
		this.handleEndDateChange = this.handleEndDateChange.bind(this);
		this.handleCardChange = this.handleCardChange.bind(this);
		this.handleResults = this.handleResults.bind(this);

	}

	handleLatFieldChange(value) {
		this.props.handleLatFieldChange(value)
	}

	handleLongFieldChange(value) {
		this.props.handleLongFieldChange(value)
	}

	handleStartDateChange(date) {
		this.props.handleStartDateChange(date)
	}

	handleEndDateChange(date) {
		this.props.handleEndDateChange(date)
	}

	handleCardChange(oldCardIndex, newCardIndex, oldCardData) {
		this.props.handleCardChange(oldCardIndex, newCardIndex, oldCardData);
	}

	handleResults(executionId, resultJson) {
		this.props.handleResults(executionId, resultJson);
	}

	render(){

		let displayComponent = null;

		// Dynamically select component for the right pane based on the selected card
		switch(this.props.activeCardIndex) {
			case 0:
				displayComponent =
					<SelectFieldsCC
						state={this.props.state}
						handleLatFieldChange={this.handleLatFieldChange}
						handleLongFieldChange={this.handleLongFieldChange}
						handleCardChange={this.handleCardChange}/>;
				break;

			case 1:
				displayComponent =
					<RunSimulationCC
						state={this.props.state}
						handleStartDateChange={this.handleStartDateChange}
						handleEndDateChange={this.handleEndDateChange}
						handleResults={this.handleResults}
						handleCardChange={this.handleCardChange}/>;
				break;

			case 2:
				displayComponent = <ViewResultsCC state={this.props.state}/>;
				break;

			case null:
				displayComponent = <SelectFieldsCC/>;
				break;
		}

		return(
			<div>{displayComponent}</div>
		);
	}
}

export default RightPaneCC;
